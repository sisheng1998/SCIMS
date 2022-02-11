const crypto = require('crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ROLES_LIST = require('../config/roles_list')

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		altEmail: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		roles: [
			{
				lab: {
					type: Schema.Types.ObjectId,
					ref: 'Lab',
				},
				role: {
					type: Number,
					default: ROLES_LIST.viewer,
				},
				isActive: {
					type: Boolean,
					default: false,
				},
			},
		],
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: String,
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
	return jwt.sign(
		{ id: this._id, roles: this.roles },
		process.env.JWT_ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
		}
	)
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

UserSchema.methods.getEmailVerificationToken = function () {
	const verificationToken = crypto.randomBytes(20).toString('hex')

	this.emailVerificationToken = crypto
		.createHash('sha256')
		.update(verificationToken)
		.digest('hex')

	return verificationToken
}

const User = mongoose.model('User', UserSchema)

module.exports = User
