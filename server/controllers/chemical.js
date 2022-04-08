const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const generateQRCode = require('../utils/generateQRCode')
const settings = require('../config/settings.json')

const labOption = 'labName labUsers chemicals locations createdAt lastUpdated'
const chemicalOption =
	'QRCode CAS name unit containerSize minAmount amount expirationDate locationId status lastUpdated'
const CASOption = 'CAS SDS classifications securities'

exports.getChemicals = async (req, res, next) => {
	const labId = req.body.labId

	try {
		const foundLab = await Lab.findById(labId, labOption).populate(
			'chemicals disposedChemicals',
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
		locationId,
		storageGroup,
		dateIn,
		dateOpen,
		expirationDate,
		classifications,
		securities,
		supplier,
		brand,
		notes,
		SDSLink,
	} = JSON.parse(req.body.chemicalInfo)

	if (
		!CAS ||
		!name ||
		!state ||
		!unit ||
		!containerSize ||
		!amount ||
		!minAmount ||
		!labId ||
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

	const foundLocation = foundLab.locations.filter((location) =>
		location._id.equals(locationId)
	)

	if (foundLocation.length === 0) {
		return next(new ErrorResponse('Location not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		let status = 'Normal'
		if (Number(amount) <= Number(minAmount)) {
			status = 'Low Amount'
		}

		const today = new Date()
		if (new Date(expirationDate) < today) {
			status = 'Expired'
		} else {
			const future = new Date(
				today.setDate(today.getDate() + settings.DAY_BEFORE_EXP)
			)
			if (new Date(expirationDate) < future) {
				status = 'Expiring Soon'
			}
		}

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
					locationId: foundLocation[0]._id,
					storageGroup,
					status,
					dateIn,
					dateOpen,
					expirationDate,
					SDS: SDSLink ? SDSLink : req.file.filename,
					classifications,
					securities,
					supplier,
					brand,
					notes,
				},
			],
			{ session }
		)

		const QRCode = await generateQRCode(chemical[0]._id)

		await Chemical.updateOne(
			chemical[0],
			{
				$set: {
					QRCode,
				},
			},
			{ new: true, session }
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

exports.updateChemical = async (req, res, next) => {
	const {
		_id,
		name,
		state,
		unit,
		containerSize,
		amount,
		minAmount,
		labId,
		locationId,
		storageGroup,
		dateIn,
		dateOpen,
		expirationDate,
		classifications,
		securities,
		supplier,
		brand,
		notes,
	} = req.body

	if (
		!_id ||
		!name ||
		!state ||
		!unit ||
		!containerSize ||
		!amount ||
		!minAmount ||
		!labId ||
		!locationId ||
		!dateIn ||
		!expirationDate
	) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundChemical = await Chemical.findById(_id)
	if (!foundChemical) {
		return next(new ErrorResponse('Chemical not found.', 404))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
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

		let status = 'Normal'
		if (Number(amount) <= Number(minAmount)) {
			status = 'Low Amount'
		}

		const today = new Date()
		if (new Date(expirationDate) < today) {
			status = 'Expired'
		} else {
			const future = new Date(
				today.setDate(today.getDate() + settings.DAY_BEFORE_EXP)
			)
			if (new Date(expirationDate) < future) {
				status = 'Expiring Soon'
			}
		}

		await Chemical.updateOne(
			foundChemical,
			{
				$set: {
					name,
					state,
					unit,
					containerSize,
					amount,
					minAmount,
					lab: foundLab._id,
					locationId: foundLocation[0]._id,
					storageGroup,
					status,
					dateIn,
					dateOpen,
					expirationDate,
					classifications,
					securities,
					supplier,
					brand,
					notes,
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		await session.commitTransaction()
		session.endSession()

		res.status(201).json({
			success: true,
			data: 'Chemical updated.',
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
		const foundChemical = await Chemical.findOne({
			_id: chemicalId,
		}).populate({
			path: 'lab',
			select: 'labOwner labName locations',
			populate: {
				path: 'labOwner',
				select: 'name',
			},
		})

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

exports.updateAmount = async (req, res, next) => {
	const { chemicalId, amount } = req.body

	try {
		const foundChemical = await Chemical.findById(chemicalId)

		if (!foundChemical) {
			return next(new ErrorResponse('Chemical not found.', 404))
		}

		if (
			foundChemical.status === 'Normal' &&
			Number(amount) <= foundChemical.minAmount
		) {
			const status = 'Low Amount'

			await Chemical.updateOne(foundChemical, {
				$set: {
					status,
					amount,
					lastUpdated: Date.now(),
				},
			})
		} else {
			await Chemical.updateOne(foundChemical, {
				$set: {
					amount,
					lastUpdated: Date.now(),
				},
			})
		}

		res.status(201).json({
			success: true,
			data: 'Chemical amount updated.',
		})
	} catch (error) {
		next(error)
	}
}

exports.disposeChemical = async (req, res, next) => {
	const { chemicalId, labId } = req.body

	if (!chemicalId || !labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	const foundChemical = await Chemical.findById(chemicalId)
	if (!foundChemical) {
		return next(new ErrorResponse('Chemical not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		await Lab.updateOne(
			foundLab,
			{
				$pull: {
					chemicals: chemicalId,
				},
				$push: {
					disposedChemicals: chemicalId,
				},
				$set: {
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		await Chemical.updateOne(
			foundChemical,
			{
				$set: {
					status: 'Disposed',
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		await session.commitTransaction()
		session.endSession()

		res.status(200).json({
			success: true,
			data: 'Chemical disposed.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		next(error)
	}
}

exports.cancelDisposal = async (req, res, next) => {
	const { chemicalId, labId } = req.body

	if (!chemicalId || !labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	const foundChemical = await Chemical.findById(chemicalId)
	if (!foundChemical) {
		return next(new ErrorResponse('Chemical not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		let status = 'Normal'
		if (Number(foundChemical.amount) <= Number(foundChemical.minAmount)) {
			status = 'Low Amount'
		}

		const today = new Date()
		if (new Date(foundChemical.expirationDate) < today) {
			status = 'Expired'
		} else {
			const future = new Date(
				today.setDate(today.getDate() + settings.DAY_BEFORE_EXP)
			)
			if (new Date(foundChemical.expirationDate) < future) {
				status = 'Expiring Soon'
			}
		}

		await Lab.updateOne(
			foundLab,
			{
				$pull: {
					disposedChemicals: chemicalId,
				},
				$push: {
					chemicals: chemicalId,
				},
				$set: {
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		await Chemical.updateOne(
			foundChemical,
			{
				$set: {
					status,
					lastUpdated: Date.now(),
				},
			},
			{ new: true, session }
		)

		await session.commitTransaction()
		session.endSession()

		res.status(200).json({
			success: true,
			data: 'Chemical disposal cancelled.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		next(error)
	}
}

exports.getCASInfo = async (req, res, next) => {
	const { CAS } = req.body
	if (!CAS) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	try {
		const foundChemical = await Chemical.findOne(
			{
				CAS,
				SDS: { $exists: true, $ne: '' },
				classifications: { $exists: true },
				securities: { $exists: true },
			},
			CASOption
		)
		if (!foundChemical) {
			return next(new ErrorResponse('Chemical not found.', 404))
		}

		res.status(200).json({
			success: true,
			data: foundChemical,
		})
	} catch (error) {
		return next(new ErrorResponse('Chemical not found.', 404))
	}
}
