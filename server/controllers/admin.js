const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')

const UserInfo =
	'name email altEmail avatar matricNo isEmailVerified registeredAt lastUpdated roles.lab roles.role roles.status'

// User
exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find({}, UserInfo).populate(
			'roles.lab',
			'labName status'
		)
		const labs = await Lab.find({}, 'labName status')

		res.status(200).json({
			success: true,
			users,
			labs,
		})
	} catch (error) {
		next(error)
	}
}

// Lab
exports.getLabs = async (req, res, next) => {
	try {
		const labs = await Lab.find({}).populate('labOwner', 'name email avatar')
		const users = await User.find(
			{ isEmailVerified: true },
			'name email avatar'
		)

		res.status(200).json({
			success: true,
			labs,
			users,
		})
	} catch (error) {
		next(error)
	}
}

exports.addLab = async (req, res, next) => {
	const { name, email, matricNo, password, labName } = req.body

	if (!name || !email || !matricNo || !password || !labName) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const duplicate = await User.findOne({ email })
	if (duplicate) {
		return next(new ErrorResponse('Email registered.', 409))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		const lab = await Lab.create(
			[
				{
					labName,
				},
			],
			{ session }
		)

		const user = await User.create(
			[
				{
					name,
					email,
					matricNo,
					password,
					roles: {
						lab: lab[0]._id,
						role: ROLES_LIST.labOwner,
						status: 'Active',
					},
					isEmailVerified: true,
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

		await session.commitTransaction()
		session.endSession()

		res.status(201).json({
			success: true,
			data: 'New user and lab created.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		if (error.code === 11000) {
			if (error.keyPattern.hasOwnProperty('labName')) {
				return next(new ErrorResponse('Lab name existed.', 409))
			} else if (error.keyPattern.hasOwnProperty('matricNo')) {
				return next(new ErrorResponse('Matric number existed.', 409))
			}
		}

		next(error)
	}
}

exports.addLabWithExistingUser = async (req, res, next) => {
	const { ownerId, labName } = req.body

	if (!ownerId || !labName) {
		return next(new ErrorResponse('Missing value.', 400))
	}

	try {
		const foundUser = await User.findById(ownerId)
		if (!foundUser) {
			return next(new ErrorResponse('User not found.', 404))
		}

		const lab = await Lab.create({
			labName,
			labOwner: foundUser._id,
		})

		await User.updateOne(foundUser, {
			$push: {
				roles: {
					lab: lab._id,
					role: ROLES_LIST.labOwner,
					status: 'Active',
				},
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		res.status(201).json({
			success: true,
			data: 'New lab created.',
		})
	} catch (error) {
		if (error.code === 11000) {
			return next(new ErrorResponse('Lab name existed.', 409))
		}

		next(error)
	}
}

exports.updateLab = async (req, res, next) => {
	const { labId, ownerId, labName, status } = req.body

	if (!labId || !ownerId || !labName || !status) {
		return next(new ErrorResponse('Missing value.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		if (!foundLab.labOwner.equals(ownerId)) {
			const previousOwnerId = foundLab.labOwner

			// Change labOwner to new lab owner id
			foundLab.labOwner = ownerId

			// Remove the role from the old lab owner's roles
			await User.updateOne(
				{ _id: previousOwnerId },
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

			const foundUser = await User.findById(ownerId)
			if (!foundUser) {
				return next(new ErrorResponse('User not found.', 404))
			}

			// Check whether the new owner already exist in the lab users list
			if (foundLab.labUsers.some((user) => user.equals(ownerId))) {
				// Update the role and status of new lab owner (role existed)
				await User.updateOne(
					foundUser,
					{
						$set: {
							'roles.$[el].role': ROLES_LIST.labOwner,
							'roles.$[el].status': 'Active',
							lastUpdated: Date.now(),
						},
					},
					{ arrayFilters: [{ 'el.lab': labId }], new: true }
				)

				// Remove the new lab owner in the lab users list
				foundLab.labUsers = foundLab.labUsers.filter(
					(userId) => !userId.equals(ownerId)
				)
			} else {
				// Push new role to new lab owner's roles (role not exist)
				await User.updateOne(foundUser, {
					$push: {
						roles: {
							lab: foundLab._id,
							role: ROLES_LIST.labOwner,
							status: 'Active',
						},
					},
					$set: {
						lastUpdated: Date.now(),
					},
				})
			}
		}

		if (foundLab.labName !== labName) {
			foundLab.labName = labName
		}

		if (foundLab.status !== status) {
			foundLab.status = status
		}

		foundLab.lastUpdated = Date.now()

		await foundLab.save()

		res.status(200).json({
			success: true,
			data: 'Lab information updated.',
		})
	} catch (error) {
		if (error.code === 11000) {
			return next(new ErrorResponse('Lab name existed.', 409))
		}

		next(error)
	}
}

exports.removeLab = async (req, res, next) => {
	const { labId } = req.body

	if (!labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const userIds = foundLab.labUsers
		userIds.push(foundLab.labOwner)

		await User.updateMany(
			{ _id: { $in: userIds } },
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

		await Lab.deleteOne({ _id: labId })

		res.status(200).json({
			success: true,
			data: 'Lab removed.',
		})
	} catch (error) {
		next(error)
	}
}
