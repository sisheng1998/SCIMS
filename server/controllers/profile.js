const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')

const UserInfo =
	'name email altEmail matricNo isEmailVerified registeredAt lastUpdated roles.lab roles.role roles.status'

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
