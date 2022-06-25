const ErrorResponse = require('../utils/errorResponse')
const Notification = require('../models/Notification')
const User = require('../models/User')

exports.getNotifications = async (req, res, next) => {
	const foundUser = await User.findById(req.user._id)

	if (!foundUser) {
		return next(new ErrorResponse('User not found.', 404))
	}

	try {
		const notifications = await Notification.find(
			{ users: foundUser._id },
			'lab chemical type date'
		)
			.sort({ date: -1 })
			.populate('chemical', 'name')
			.populate('lab', 'labName')
			.populate('requestor', 'name')

		if (foundUser.notification) {
			foundUser.notification = false
			await foundUser.save()
		}

		res.status(200).json({
			success: true,
			data: notifications,
		})
	} catch (error) {
		next(error)
	}
}
