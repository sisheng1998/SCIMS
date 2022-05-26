const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const init = require('../config/init.json')
const sendEmail = require('../utils/sendEmail')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')

module.exports = async () => {
	const users = await User.countDocuments({})

	if (users === 0) {
		if (
			!init.name ||
			!init.email ||
			!init.matricNo ||
			!init.password ||
			!init.labName
		) {
			return next(new ErrorResponse('Missing value for required field.', 400))
		}

		const session = await startSession()

		try {
			session.startTransaction()

			const lab = await Lab.create(
				[
					{
						labName: init.labName,
					},
				],
				{ session }
			)

			const user = await User.create(
				[
					{
						name: init.name,
						matricNo: init.matricNo,
						email: init.email,
						password: init.password,
						roles: {
							lab: lab[0]._id,
							role: ROLES_LIST.admin,
							status: 'Active',
						},
					},
				],
				{ session }
			)

			await Lab.updateOne(
				lab[0],
				{
					$set: {
						labOwner: user[0]._id,
					},
				},
				{ new: true, session }
			)

			const emailVerificationToken = user[0].getEmailVerificationToken()
			await user[0].save()

			const emailVerificationUrl = `${process.env.DOMAIN_NAME}/verify-email/${emailVerificationToken}`

			sendEmail({
				to: user[0].email,
				subject: 'Email Verification Request',
				template: 'email_verification',
				context: {
					url: emailVerificationUrl,
				},
			})

			await session.commitTransaction()
			session.endSession()
		} catch (error) {
			await session.abortTransaction()
			session.endSession()

			next(error)
		}
	}
}
