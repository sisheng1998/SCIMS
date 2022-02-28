const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const ROLES_LIST = require('../config/roles_list')

const UserInfo =
	'name email altEmail isEmailVerified roles.lab roles.role roles.status'

// User
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

// Lab
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
				})
			}
		}

		if (foundLab.labName !== labName) {
			foundLab.labName = labName
		}

		if (foundLab.status !== status) {
			foundLab.status = status
		}

		await foundLab.save()

		res.status(200).json({
			success: true,
			data: 'Lab information updated.',
		})
	} catch (error) {
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
