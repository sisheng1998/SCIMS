const ErrorResponse = require('../utils/errorResponse')
const Subscriber = require('../models/Subscriber')
const sendNotification = require('../utils/sendNotification')

exports.subscribe = async (req, res, next) => {
	const { endpoint, keys } = req.body

	if (!endpoint || !keys) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const subscribedUser = await Subscriber.findOne({ user: req.user._id })

	try {
		if (subscribedUser) {
			await Subscriber.updateOne(
				subscribedUser,
				{
					$set: {
						endpoint,
						keys,
						subscribedAt: Date.now(),
					},
				},
				{ new: true }
			)
		} else {
			await Subscriber.create({
				user: req.user._id,
				endpoint,
				keys,
			})
		}

		res.status(200).json({
			success: true,
			data: 'Subscription saved.',
		})

		const subscription = { endpoint, keys }
		const payload = JSON.stringify({
			title: 'Notification Allowed',
			message:
				'Important notifications will be sent to this device in the future.',
			url: '/profile',
		})

		sendNotification(subscription, payload)
	} catch (error) {
		next(error)
	}
}

exports.unsubscribe = async (req, res, next) => {
	const subscribedUser = await Subscriber.findOne({ user: req.user._id })
	if (!subscribedUser) {
		return next(new ErrorResponse('Subscriber not found.', 404))
	}

	try {
		await Subscriber.deleteOne(subscribedUser)

		res.status(200).json({
			success: true,
			data: 'Subscription removed.',
		})
	} catch (error) {
		next(error)
	}
}
