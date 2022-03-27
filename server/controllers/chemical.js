const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const labOption = 'chemicals locations'
const chemicalOption =
	'QRCode CAS name unit containerSize amount expirationDate locationId status'
const UserInfo = 'name email isEmailVerified roles.lab roles.role roles.status'
const labInfo = 'labName labOwner labUsers locations'

exports.getChemicals = async (req, res, next) => {
	const labId = req.body.labId

	try {
		const foundLab = await Lab.findById(labId, labOption).populate(
			'chemicals',
			chemicalOption
		)

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

exports.addChemical = async (req, res, next) => {
	const {
		CAS,
		name,
		state,
		unit,
		containerSize,
		amount,
		minAmount,
		labId,
		ownerId,
		locationId,
		storageGroup,
		dateIn,
		dateOpen,
		expirationDate,
		supplier,
		brand,
		notes,
	} = req.body

	if (
		!CAS ||
		!name ||
		!state ||
		!unit ||
		!containerSize ||
		!amount ||
		!minAmount ||
		!labId ||
		!ownerId ||
		!locationId ||
		!dateIn ||
		!expirationDate
	) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	const foundUser = await User.findById(ownerId)
	if (!foundUser) {
		return next(new ErrorResponse('User not found.', 404))
	}

	const foundLocation = foundLab.locations.filter((location) =>
		location._id.equals(locationId)
	)

	if (foundLocation.length === 0) {
		return next(new ErrorResponse('Location not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		const chemical = await Chemical.create(
			[
				{
					CAS,
					name,
					state,
					unit,
					containerSize,
					amount,
					minAmount,
					lab: foundLab._id,
					owner: foundUser._id,
					locationId: foundLocation[0]._id,
					storageGroup,
					dateIn,
					dateOpen,
					expirationDate,
					supplier,
					brand,
					notes,
				},
			],
			{ session }
		)

		await Lab.updateOne(
			foundLab,
			{
				$push: {
					chemicals: chemical[0]._id,
				},
				$set: {
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		await session.commitTransaction()
		session.endSession()

		res.status(201).json({
			success: true,
			data: 'New chemical added.',
			chemicalId: chemical[0]._id,
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		next(error)
	}
}

exports.getChemicalInfo = async (req, res, next) => {
	const chemicalId = ObjectId(req.params.chemicalId)

	try {
		const foundChemical = await Chemical.findById(chemicalId)
			.populate({
				path: 'lab',
				select: labInfo,
				populate: {
					path: 'labUsers labOwner',
					select: UserInfo,
				},
			})
			.populate('owner', 'name email')
		if (!foundChemical) {
			return next(new ErrorResponse('Chemical not found.', 404))
		}

		res.status(201).json({
			success: true,
			data: foundChemical,
		})
	} catch (error) {
		next(error)
	}
}
