const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')

const UserInfo =
	'name email altEmail isEmailVerified roles.lab roles.role roles.status'

exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find({}, UserInfo)

		res.status(200).json({
			success: true,
			users,
		})
	} catch (error) {
		next(error)
	}
}
