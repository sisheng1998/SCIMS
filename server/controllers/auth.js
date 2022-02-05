const crypto = require('crypto')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')

exports.register = async (req, res, next) => {
	const { name, email, password } = req.body

	try {
		const user = await User.create({
			name,
			email,
			password,
		})
	} catch (error) {
		next(error)
	}
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body

	if (!email || !password) {
		return next(new ErrorResponse('Missing value.', 400))
	}

	try {
		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			return next(new ErrorResponse('Invalid credentials.', 401))
		}

		const isMatch = await user.matchPassword(password)

		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials.', 401))
		}

		sendToken(user, 200, res)
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
}

exports.logout = async (req, res, next) => {
	// On client side, the accessToken also being deleted

	const refreshToken = req.cookies.refreshToken

	if (!refreshToken) {
		return next(new ErrorResponse('Refresh token not found.', 204))
	}

	try {
		const foundUser = await User.findOne({ refreshToken: refreshToken })

		if (!foundUser) {
			res
				.status(204)
				.cookie('refreshToken', '', {
					httpOnly: true,
					maxAge: 0,
				})
				.send()
			return
		}

		foundUser.refreshToken = undefined
		await foundUser.save()

		res
			.status(204)
			.cookie('refreshToken', '', {
				httpOnly: true,
				maxAge: 0,
			})
			.send()
	} catch (error) {
		res
			.status(204)
			.cookie('refreshToken', '', {
				httpOnly: true,
				maxAge: 0,
			})
			.send()
		return
	}
}

exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return next(new ErrorResponse('Email could not be sent.', 404))
		}

		const resetToken = user.getResetPasswordToken()

		await user.save()

		const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

		const message = `
			<h1>You have requested a password reset.</h1>
			<p>Please go to this link to reset your password</p>
			<a clicktracking=off href=${resetUrl}>${resetUrl}</a>
		`

		try {
			await sendEmail({
				to: user.email,
				subject: '[SCIMS] Password Reset Request',
				text: message,
			})

			res.status(200).json({ success: true, data: 'Email sent.' })
		} catch (error) {
			user.resetPasswordToken = undefined
			user.resetPasswordExpire = undefined

			await user.save()

			return next(new ErrorResponse('Email could not be sent.', 500))
		}
	} catch (error) {
		next(error)
	}
}

exports.resetPassword = async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex')

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		})

		if (!user) {
			return next(new ErrorResponse('Invalid reset token.', 400))
		}

		user.password = req.body.password
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save()

		res.status(201).json({
			success: true,
			data: 'Password reset success.',
		})
	} catch (error) {
		next(error)
	}
}

exports.refreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken

	if (!refreshToken) {
		return next(new ErrorResponse('Invalid refresh token.', 401))
	}

	try {
		const foundUser = await User.findOne({ refreshToken: refreshToken })

		if (!foundUser) {
			return next(new ErrorResponse('User not found.', 403))
		}

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_TOKEN_SECRET
		)

		if (foundUser.email !== decoded.email) {
			return next(new ErrorResponse('User not found.', 403))
		}

		const accessToken = foundUser.getAccessToken()

		res.status(200).json({
			success: true,
			accessToken: accessToken,
		})
	} catch (error) {
		return next(new ErrorResponse('Invalid refresh token.', 401))
	}
}

const sendToken = async (user, statusCode, res) => {
	const accessToken = user.getAccessToken()
	const refreshToken = user.getRefreshToken()

	user.refreshToken = refreshToken
	await user.save()

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		maxAge: process.env.COOKIE_REFRESH_TOKEN_EXPIRE,
	})

	res.status(statusCode).json({
		success: true,
		accessToken: accessToken,
	})
}
