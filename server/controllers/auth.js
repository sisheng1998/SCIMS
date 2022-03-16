const crypto = require('crypto')
const User = require('../models/User')
const Lab = require('../models/Lab')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const ROLES_LIST = require('../config/roles_list')

exports.register = async (req, res, next) => {
	const { name, email, password, labId, matricNo } = req.body

	if (!name || !email || !password || !labId || !matricNo) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const duplicate = await User.findOne({ email })
	if (duplicate) {
		return next(new ErrorResponse('Email registered.', 409))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const user = await User.create({
			name,
			email,
			password,
			matricNo,
			roles: {
				lab: foundLab._id,
			},
		})

		await Lab.updateOne(foundLab, {
			$push: {
				labUsers: user._id,
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		const emailVerificationToken = user.getEmailVerificationToken()

		await user.save()

		sendVerificationEmail(user, emailVerificationToken, res, next)
	} catch (error) {
		if (error.code === 11000 && error.keyPattern.hasOwnProperty('matricNo')) {
			return next(new ErrorResponse('Matric number existed.', 409))
		}

		next(error)
	}
}

exports.emailVerification = async (req, res, next) => {
	const emailVerificationToken = crypto
		.createHash('sha256')
		.update(req.params.emailVerificationToken)
		.digest('hex')

	try {
		const user = await User.findOne({
			emailVerificationToken,
		})

		if (!user) {
			return next(new ErrorResponse('Invalid email verification token.', 400))
		}

		user.emailVerificationToken = undefined
		user.isEmailVerified = true
		user.lastUpdated = Date.now()

		await user.save()

		res.status(201).json({
			success: true,
			data: 'Account activated.',
		})
	} catch (error) {
		next(error)
	}
}

exports.sendEmailVerification = async (req, res, next) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return next(new ErrorResponse('User not found.', 404))
		}

		const emailVerificationToken = user.getEmailVerificationToken()

		await user.save()

		sendVerificationEmail(user, emailVerificationToken, res, next)
	} catch (error) {
		next(error)
	}
}

exports.login = async (req, res, next) => {
	const { email, password, rememberMe } = req.body

	if (!email || !password) {
		return next(new ErrorResponse('Missing value.', 400))
	}

	try {
		const user = await User.findOne({ email })
			.select('+password')
			.populate('roles.lab', 'labName status')

		if (!user) {
			return next(new ErrorResponse('Invalid credentials.', 401))
		}

		const isMatch = await user.matchPassword(password)

		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials.', 401))
		}

		if (!user.isEmailVerified) {
			return next(new ErrorResponse('Email not verified.', 403))
		}

		sendToken(user, rememberMe, 200, res)
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

	res
		.status(204)
		.cookie('refreshToken', '', {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 0,
		})
		.send()
}

exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return next(new ErrorResponse('User not found.', 404))
		}

		const resetToken = user.getResetPasswordToken()

		await user.save()

		const resetUrl = `${process.env.DOMAIN_NAME}/reset-password/${resetToken}`

		const message = `
			<h1>You have requested a password reset.</h1>
			<p>Please click the link below to reset your password.</p>
			<a clicktracking=off href=${resetUrl}>${resetUrl}</a>
			<p>The link will be valid for 30 minutes only.</p>
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
			return next(new ErrorResponse('Invalid reset password token.', 400))
		}

		user.password = req.body.password
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined
		user.lastUpdated = Date.now()

		await user.save()

		res.status(201).json({
			success: true,
			data: 'Password reset successful.',
		})
	} catch (error) {
		next(error)
	}
}

exports.refreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken

	if (!refreshToken) {
		return res.sendStatus(204)
	}

	try {
		const foundUser = await User.findOne({
			refreshToken: refreshToken,
		}).populate('roles.lab', 'labName status')

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
			email: foundUser.email,
			accessToken: accessToken,
			roles: foundUser.roles,
			id: foundUser._id,
		})
	} catch (error) {
		return next(new ErrorResponse('Invalid refresh token.', 401))
	}
}

exports.labs = (req, res, next) => {
	try {
		Lab.find({ status: 'In Use' }, 'labName', (err, data) => {
			if (!err) {
				res.status(200).json({
					success: true,
					labs: data,
				})
			}
		})
	} catch (error) {
		return next(new ErrorResponse('Lab not found.', 404))
	}
}

exports.emails = (req, res, next) => {
	try {
		User.find({}, 'email', (err, data) => {
			if (!err) {
				res.status(200).json({
					success: true,
					emails: data,
				})
			}
		})
	} catch (error) {
		return next(new ErrorResponse('Email not found.', 404))
	}
}

exports.applyNewLab = async (req, res, next) => {
	const { email, labId } = req.body

	if (!email || !labId) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundUser = await User.findOne({ email })
	if (!foundUser) {
		return next(new ErrorResponse('Email registered.', 409))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const isUserExisted =
			foundLab.labUsers.some((user) => user._id.equals(foundUser._id)) ||
			foundLab.labOwner.equals(foundUser._id)

		if (isUserExisted) {
			return next(new ErrorResponse('User existed.', 409))
		}

		await User.updateOne(foundUser, {
			$push: {
				roles: {
					lab: labId,
					role: ROLES_LIST.guest,
				},
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		await Lab.updateOne(foundLab, {
			$push: {
				labUsers: foundUser._id,
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		res.status(200).json({
			success: true,
			data: 'New lab applied.',
		})
	} catch (error) {
		next(error)
	}
}

const sendToken = async (user, rememberMe, statusCode, res) => {
	const accessToken = user.getAccessToken()
	const refreshToken = user.getRefreshToken()

	user.rememberMe = rememberMe
	user.refreshToken = refreshToken
	await user.save()

	let expiryDate = new Date(
		Date.now() + Number(process.env.COOKIE_REFRESH_TOKEN_EXPIRE)
	)
	expiryDate.setHours(0, 0, 0, 0)

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		sameSite: 'None',
		secure: true,
		expires: user.rememberMe ? expiryDate : false,
	})

	res.status(statusCode).json({
		success: true,
		accessToken: accessToken,
		roles: user.roles,
		id: user._id,
	})
}

const sendVerificationEmail = async (
	user,
	emailVerificationToken,
	res,
	next
) => {
	const emailVerificationUrl = `${process.env.DOMAIN_NAME}/verify-email/${emailVerificationToken}`

	const message = `
			<h1>You have registered an account with this email.</h1>
			<p>Please click the verification link below to verify your email.</p>
			<a clicktracking=off href=${emailVerificationUrl}>${emailVerificationUrl}</a>
		`

	try {
		await sendEmail({
			to: user.email,
			subject: '[SCIMS] Email Verification Request',
			text: message,
		})

		res.status(201).json({
			success: true,
			data: 'The verification email has been sent.',
		})
	} catch (error) {
		return next(new ErrorResponse('Email could not be sent.', 500))
	}
}
