const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')

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

exports.addUser = async (req, res, next) => {
	const { name, email, altEmail, password, labId, role } = req.body

	if (!name || !email || !altEmail || !password || !labId || !role) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const duplicate = await User.findOne({ email })
	if (duplicate) {
		return next(new ErrorResponse('Email registered.', 409))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const user = await User.create({
			name,
			email,
			altEmail,
			password,
			roles: {
				lab: foundLab._id,
				role,
				status: 'Active',
			},
			isEmailVerified: true,
		})

		await Lab.updateOne(foundLab, {
			$push: {
				labUsers: user._id,
			},
		})

		await user.save()

		res.status(201).json({
			success: true,
			data: 'New user created.',
		})
	} catch (error) {
		if (error.code === 11000) {
			return next(new ErrorResponse('Alternative email address existed.', 409))
		}

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
			}
		)

		await Lab.updateOne(
			{ _id: labId },
			{
				$pull: {
					labUsers: userId,
				},
			}
		)

		res.status(200).json({
			success: true,
			data: 'User removed.',
		})
	} catch (error) {
		console.log(error)
		next(error)
	}
}
