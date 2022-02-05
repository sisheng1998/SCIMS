const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please provide a valid email.',
			],
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		refreshToken: String,
	},
	{ collection: 'users' }
)

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)

	next()
})

UserSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getAccessToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
	})
}

UserSchema.methods.getRefreshToken = function () {
	return jwt.sign({ email: this.email }, process.env.JWT_REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
	})
}

UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex')

	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	// (60 * 1000) = 1 min
	this.resetPasswordExpire = Date.now() + 30 * (60 * 1000)

	return resetToken
}

const User = mongoose.model('User', UserSchema)

module.exports = User
