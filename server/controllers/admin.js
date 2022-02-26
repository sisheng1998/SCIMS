const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')

const UserInfo =
	'name email altEmail isEmailVerified roles.lab roles.role roles.status'

exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find({}, UserInfo).populate('roles.lab', 'labName')

		res.status(200).json({
			success: true,
			users,
		})
	} catch (error) {
		next(error)
	}
}

exports.getLabs = async (req, res, next) => {
	try {
		const labs = await Lab.find({}).populate('labOwner', 'name email')
		const users = await User.find({}, 'name email')

		res.status(200).json({
			success: true,
			labs,
			users,
		})
	} catch (error) {
		next(error)
	}
}
