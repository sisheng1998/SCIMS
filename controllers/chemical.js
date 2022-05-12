const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const CAS = require('../models/CAS')
const Usage = require('../models/Usage')
const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const generateQRCode = require('../utils/generateQRCode')
const settings = require('../config/settings.json')
const COCLists = require('../chemicalData/coc.json')
const GHSLists = require('../chemicalData/ghs.json')
const pictograms = require('../chemicalData/pictograms.json')

const getKeysByValue = (object, value) =>
	Object.keys(object).filter((key) => object[key] === value)

const labOption = 'labName labUsers chemicals locations createdAt lastUpdated'
const chemicalOption =
	'QRCode CASId name unit containerSize minAmount amount expirationDate disposedDate locationId storageGroup status createdAt lastUpdated'

exports.getChemicals = async (req, res, next) => {
	const labId = req.body.labId

	try {
		const foundLab = await Lab.findById(labId, labOption).populate({
			path: 'chemicals disposedChemicals',
			select: chemicalOption,
			populate: {
				path: 'CASId',
				model: 'CAS',
			},
		})

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
		CASNo,
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
		COCs,
		supplier,
		brand,
		notes,
	} = JSON.parse(req.body.chemicalInfo)

	if (
		!CASNo ||
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

		const chemicalData = {
			name,
			state,
			unit,
			containerSize: Number(containerSize).toFixed(2),
			amount: Number(amount).toFixed(2),
			minAmount: Number(minAmount).toFixed(2),
			lab: foundLab._id,
			locationId: foundLocation[0]._id,
			storageGroup,
			status,
			dateIn,
			expirationDate,
			supplier,
			brand,
			notes,
		}

		const foundCAS = await CAS.findOne({ CASNo })
		if (!foundCAS) {
			const newCAS = await CAS.create(
				[
					{
						CASNo,
						SDS: req.file.filename,
						classifications,
						COCs,
					},
				],
				{ session }
			)

			chemicalData.CASId = newCAS[0]._id
		} else {
			chemicalData.CASId = foundCAS._id
		}

		if (dateOpen !== '') {
			chemicalData.dateOpen = dateOpen
		}

		const chemical = await Chemical.create([chemicalData], { session })

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
		containerSize,
		amount,
		minAmount,
		labId,
		locationId,
		storageGroup,
		dateIn,
		dateOpen,
		expirationDate,
		supplier,
		brand,
		notes,
	} = req.body

	if (!_id || !labId || !locationId) {
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

		const updateQuery = { lastUpdated: Date.now() }
		const removeQuery = {}

		if (status && status !== foundChemical.status) {
			updateQuery.status = status
		}

		if (name && name !== foundChemical.name) {
			updateQuery.name = name
		}

		if (state && state !== foundChemical.state) {
			updateQuery.state = state
		}

		if (
			containerSize &&
			Number(containerSize).toFixed(2) !==
				Number(foundChemical.containerSize).toFixed(2)
		) {
			updateQuery.containerSize = Number(containerSize).toFixed(2)
		}

		if (
			amount &&
			Number(amount).toFixed(2) !== Number(foundChemical.amount).toFixed(2)
		) {
			updateQuery.amount = Number(amount).toFixed(2)
		}

		if (
			minAmount &&
			Number(minAmount).toFixed(2) !==
				Number(foundChemical.minAmount).toFixed(2)
		) {
			updateQuery.minAmount = Number(minAmount).toFixed(2)
		}

		if (labId && !foundChemical.lab.equals(labId)) {
			updateQuery.lab = foundLab._id
		}

		if (locationId && foundChemical.locationId !== locationId) {
			updateQuery.locationId = foundLocation[0]._id
		}

		if (storageGroup !== foundChemical.storageGroup) {
			updateQuery.storageGroup = storageGroup
		}

		if (
			dateIn &&
			new Date(dateIn).getTime() !== new Date(foundChemical.dateIn).getTime()
		) {
			updateQuery.dateIn = dateIn
		}

		if (dateOpen === '' && foundChemical.dateOpen) {
			removeQuery.dateOpen = ''
		} else if (
			dateOpen &&
			new Date(dateOpen).getTime() !==
				new Date(foundChemical.dateOpen).getTime()
		) {
			updateQuery.dateOpen = dateOpen
		}

		if (
			expirationDate &&
			new Date(expirationDate).getTime() !==
				new Date(foundChemical.expirationDate).getTime()
		) {
			updateQuery.expirationDate = expirationDate
		}

		if (supplier !== foundChemical.supplier) {
			updateQuery.supplier = supplier
		}

		if (brand !== foundChemical.brand) {
			updateQuery.brand = brand
		}

		if (notes !== foundChemical.notes) {
			updateQuery.notes = notes
		}

		await Chemical.updateOne(
			foundChemical,
			{
				$set: updateQuery,
				$unset: removeQuery,
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
		})
			.populate('CASId')
			.populate({
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
	const { chemicalId, usage } = req.body

	if (!chemicalId || !usage) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundChemical = await Chemical.findById(chemicalId)
	if (!foundChemical) {
		return next(new ErrorResponse('Chemical not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		const amount = Number(Number(foundChemical.amount) - Number(usage)).toFixed(
			2
		)
		const updateQuery = {
			amount,
			lastUpdated: Date.now(),
		}

		if (
			foundChemical.status === 'Normal' &&
			Number(amount) <= foundChemical.minAmount
		) {
			updateQuery.status = 'Low Amount'
		}

		if (!foundChemical.dateOpen) {
			updateQuery.dateOpen = Date.now()
		}

		await Usage.create(
			[
				{
					lab: foundChemical.lab,
					user: req.user._id,
					chemical: foundChemical._id,
					originalAmount: foundChemical.amount,
					usage: Number(usage).toFixed(2),
				},
			],
			{ session }
		)

		await Chemical.updateOne(
			foundChemical,
			{
				$set: updateQuery,
			},
			{ session }
		)

		await session.commitTransaction()
		session.endSession()

		res.status(201).json({
			success: true,
			data: 'Chemical amount updated.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

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
					disposedDate: Date.now(),
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
				$unset: {
					disposedDate: '',
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
	const { CASNo } = req.body
	if (!CASNo) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	try {
		const foundCAS = await CAS.findOne({ CASNo })

		if (!foundCAS) {
			let CASInfo = { SDS: '', classifications: [], COCs: [] }

			const foundGHSs = GHSLists.find((list) => list.CASNumber.includes(CASNo))

			if (foundGHSs && foundGHSs.pictograms.includes(',')) {
				const GHSs = foundGHSs.pictograms.split(',')

				CASInfo.classifications = GHSs.filter((GHS) =>
					GHS.toLowerCase().includes('ghs')
				).map((GHS) => pictograms[GHS])
			}

			const foundCOCs = COCLists.find((list) => list.CASNumber === CASNo)

			if (foundCOCs) {
				CASInfo.COCs = getKeysByValue(foundCOCs, 1)
			}

			res.status(200).json({
				success: true,
				data: CASInfo,
			})
		} else {
			res.status(200).json({
				success: true,
				data: foundCAS,
			})
		}
	} catch (error) {
		return next(error)
	}
}
