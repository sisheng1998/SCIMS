const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')

const UserInfo =
	'name email altEmail avatar matricNo isEmailVerified registeredAt lastUpdated roles.lab roles.role roles.status'

exports.getProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id, UserInfo).populate(
			'roles.lab',
			'labName status'
		)

		if (!user) {
			return next(new ErrorResponse('User not found.', 404))
		}

		res.status(200).json({
			success: true,
			user,
		})
	} catch (error) {
		return next(new ErrorResponse('User not found.', 404))
	}
}

exports.updateAvatar = async (req, res, next) => {
	const url = req.protocol + '://' + req.get('host')
	const userId = req.user._id

	if (!userId) {
		return next(new ErrorResponse('Missing value.', 400))
	}

	try {
		const foundUser = await User.findById(userId)
		if (!foundUser) {
			return next(new ErrorResponse('User not found.', 404))
		}

		await User.updateOne(foundUser, {
			$set: {
				avatar: url + '/public/avatars/' + req.file.filename,
				lastUpdated: Date.now(),
			},
		})

		res.status(201).json({
			success: true,
			data: 'User avatar updated',
		})
	} catch (error) {
		next(error)
	}
}
