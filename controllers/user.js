const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')
const sendEmail = require('../utils/sendEmail')

const UserInfo =
	'name email altEmail avatar matricNo isEmailVerified createdAt lastUpdated roles.lab roles.role roles.status'

exports.getUsers = async (req, res, next) => {
	const labId = req.body.labId

	try {
		const foundLab = await Lab.findById(labId)
			.populate('labOwner', UserInfo)
			.populate('labUsers', UserInfo)

		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		// Get all existing users that are not in the current lab - for lab owner or admin to add existing user to their lab
		if (res.locals.user.role >= ROLES_LIST.labOwner) {
			const otherUsers = await User.find(
				{ isEmailVerified: true, 'roles.lab': { $ne: labId } },
				'name email'
			)

			res.status(200).json({
				success: true,
				data: foundLab,
				otherUsers: otherUsers,
			})
		} else {
			res.status(200).json({
				success: true,
				data: foundLab,
			})
		}
	} catch (error) {
		return next(new ErrorResponse('Lab not found.', 404))
	}
}

exports.addUser = async (req, res, next) => {
	const { name, email, matricNo, password, labId, role } = req.body

	if (!name || !email || !matricNo || !password || !labId || !role) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const duplicate = await User.findOne({ email })
	if (duplicate) {
		return next(new ErrorResponse('Email registered.', 409))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		const user = await User.create(
			[
				{
					name,
					email,
					matricNo,
					password,
					roles: {
						lab: foundLab._id,
						role,
					},
				},
			],
			{ session }
		)

		await Lab.updateOne(
			foundLab,
			{
				$push: {
					labUsers: user[0]._id,
				},
				$set: {
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		const emailVerificationToken = user[0].getEmailVerificationToken()
		await user[0].save()

		const emailVerificationUrl = `${process.env.DOMAIN_NAME}/verify-email/${emailVerificationToken}`

		const message = `
			<p>You have an account registered with this email.</p>
			<p>Please click the verification link below to verify your email.</p>
			<a clicktracking=off href=${emailVerificationUrl}>${emailVerificationUrl}</a>`

		await sendEmail({
			to: user[0].email,
			subject: '[SCIMS] Email Verification Request',
			text: message,
		})

		await session.commitTransaction()
		session.endSession()

		res.status(201).json({
			success: true,
			data: 'New user created.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		if (error.code === 11000 && error.keyPattern.hasOwnProperty('matricNo')) {
			return next(new ErrorResponse('Matric number existed.', 409))
		}

		next(error)
	}
}

exports.userApproval = async (req, res, next) => {
	const { userId, labId, role, message, approve } = req.body

	if (!userId || !labId) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundUser = await User.findById(userId)
	if (!foundUser) {
		return next(new ErrorResponse('User not found.', 404))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		let emailMessage = `
			<p>Lab Name: <strong>Lab ${foundLab.labName}</strong></p>
			<p>Status: <strong>${approve ? 'Approved' : 'Declined'}</strong></p>
			<p>Message from the lab owner: <strong>${message ? message : '-'}</strong></p>
		`

		if (approve) {
			await User.updateOne(
				foundUser,
				{
					$set: {
						'roles.$[el].role': role,
						'roles.$[el].status': 'Active',
						lastUpdated: Date.now(),
					},
				},
				{ arrayFilters: [{ 'el.lab': labId }], new: true, session }
			)

			emailMessage =
				emailMessage + `<p>You are able to access the lab from the system.</p>`
		} else {
			await User.updateOne(
				foundUser,
				{
					$pull: {
						roles: {
							lab: labId,
						},
					},
					$set: {
						lastUpdated: Date.now(),
					},
				},
				{ new: true, session }
			)

			await Lab.updateOne(
				foundLab,
				{
					$pull: {
						labUsers: userId,
					},
					$set: {
						lastUpdated: Date.now(),
					},
				},
				{ new: true, session }
			)

			emailMessage =
				emailMessage +
				`<p>You may try to apply for the lab again after fulfilled the requirement (if any from the lab owner's message).</p>`
		}

		await sendEmail({
			to: foundUser.email,
			subject: '[SCIMS] User Request Approval Result',
			text: emailMessage,
		})

		await session.commitTransaction()
		session.endSession()

		res.status(200).json({
			success: true,
			data: 'User approval success.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		next(error)
	}
}

exports.addExistingUser = async (req, res, next) => {
	const { userId, labId, role } = req.body

	if (!userId || !labId || !role) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundUser = await User.findById(userId)
	if (!foundUser) {
		return next(new ErrorResponse('User not found.', 404))
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
					lab: foundLab._id,
					role,
				},
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		await Lab.updateOne(foundLab, {
			$push: {
				labUsers: userId,
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		res.status(200).json({
			success: true,
			data: 'User added.',
		})
	} catch (error) {
		next(error)
	}
}

exports.updateUser = async (req, res, next) => {
	const { userId, labId, status, role } = req.body

	if (!userId || !labId || !status || !role) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	try {
		await User.findOneAndUpdate(
			{ _id: userId },
			{
				$set: {
					'roles.$[el].role': role,
					'roles.$[el].status': status,
					lastUpdated: Date.now(),
				},
			},
			{ arrayFilters: [{ 'el.lab': labId }], new: true }
		)

		res.status(200).json({
			success: true,
			data: 'User information updated.',
		})
	} catch (error) {
		next(error)
	}
}

exports.removeUser = async (req, res, next) => {
	const { userId, labId } = req.body

	if (!userId || !labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	try {
		await User.updateOne(
			{ _id: userId },
			{
				$pull: {
					roles: {
						lab: labId,
					},
				},
				$set: {
					lastUpdated: Date.now(),
				},
			}
		)

		await Lab.updateOne(
			{ _id: labId },
			{
				$pull: {
					labUsers: userId,
				},
				$set: {
					lastUpdated: Date.now(),
				},
			}
		)

		res.status(200).json({
			success: true,
			data: 'User removed.',
		})
	} catch (error) {
		next(error)
	}
}
