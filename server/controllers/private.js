const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')

const UserInfo =
	'name email altEmail isEmailVerified roles.lab roles.role roles.status'

// Users
exports.getUsers = async (req, res, next) => {
	const labId = req.body.labId

	try {
		const foundLab = await Lab.findById(labId)
			.populate('labOwner', UserInfo)
			.populate('labUsers', UserInfo)

		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		res.status(200).json({
			success: true,
			data: foundLab,
		})
	} catch (error) {
		return next(new ErrorResponse('Lab not found.', 404))
	}
}
