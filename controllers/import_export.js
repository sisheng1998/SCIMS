const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const CAS = require('../models/CAS')
const Activity = require('../models/Activity')
const { startSession } = require('mongoose')
const generateQRCode = require('../utils/generateQRCode')
const settings = require('../config/settings.json')
const COCLists = require('../chemical_data/coc.json')
const GHSLists = require('../chemical_data/ghs.json')
const pictograms = require('../chemical_data/pictograms.json')

exports.importChemicals = async (req, res, next) => {
	const { labId, chemicals, filename } = req.body

	if (!labId || !chemicals) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundLab = await Lab.findById(labId)

	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	const session = await startSession()

	try {
		session.startTransaction()

		let errorMessage = ''
		const results = {
			filename,
			new: [],
			updated: [],
			failed: [],
		}

		const locations = foundLab.locations.map((location) => ({
			_id: location._id,
			name: location.name,
		}))

		const CASs = await CAS.find({}, 'CASNo')

		for (const [index, chemical] of chemicals.entries()) {
			errorMessage = validate(chemical, index)
			if (errorMessage) break

			await addChemical(
				foundLab,
				locations,
				CASs,
				chemical,
				index,
				session,
				results
			)
		}

		await Activity.create(
			[
				{
					lab: foundLab._id,
					user: req.user._id,
					description: 'Import successful.',
					importLog: results,
				},
			],
			{ session }
		)

		if (errorMessage) {
			await session.abortTransaction()
			session.endSession()

			res.status(409).json({
				success: false,
				error: errorMessage,
			})
		} else {
			//await session.commitTransaction()
			await session.abortTransaction()
			session.endSession()

			res.status(200).json({
				success: true,
				results,
			})
		}
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		next(error)
	}
}

exports.exportChemicals = async (req, res, next) => {
	const { labId, columns, status } = req.body

	if (!labId || !columns || !status) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundLab = await Lab.findById(labId, 'locations._id locations.name')

	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	try {
		const chemicalOptions = `${columns.join(' ')}${
			columns.includes('_id') ? '' : ' -_id'
		}`

		const chemicals = await Chemical.find(
			{
				lab: foundLab._id,
				status: {
					$in: status,
				},
			},
			chemicalOptions
		).populate('CASId', '-_id CASNo')

		res.status(200).json({
			success: true,
			chemicals,
			locations: foundLab.locations,
		})
	} catch (error) {
		next(error)
	}
}

// Functions for import chemicals
const ID_REGEX = /^[a-f\d]{24}$/i
const CAS_REGEX = /^\b[1-9]{1}[0-9]{1,6}-\d{2}-\d\b$/
const NAME_REGEX_WITH_NUMBER = /^[a-zA-Z0-9,.'-/]+( [a-zA-Z0-9,.'-/]+)*$/
const STATE = ['solid', 'liquid', 'gas']
const UNIT = ['kg', 'g', 'mg', 'L', 'mL']
const NUMBER_REGEX = /^\d{1,}(\.\d{1,2})?$/
const STORAGE_GROUPS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'j', 'k', 'l', 'x']
const CHEMICAL_STATUS = [
	'normal',
	'low amount',
	'expiring soon',
	'expired',
	'disposed',
]

const formatDate = (date) => new Date(date.split('/').reverse().join('-'))

const getKeysByValue = (object, value) =>
	Object.keys(object).filter((key) => object[key] === value)

const validate = (chemical, index) => {
	let errorMessage = ''

	if (
		!chemical.CASNo ||
		!chemical.name ||
		!chemical.state ||
		!chemical.unit ||
		!chemical.containerSize ||
		!chemical.amount ||
		!chemical.minAmount ||
		!chemical.dateIn ||
		!chemical.expirationDate
	) {
		return `Chemical No. ${index + 1}: Missing value for required field(s).`
	}

	switch (true) {
		case chemical._id !== '' && !ID_REGEX.test(chemical._id):
			errorMessage = 'Invalid ID.'
			break
		case !CAS_REGEX.test(chemical.CASNo):
			errorMessage = 'Invalid CAS No.'
			break
		case !NAME_REGEX_WITH_NUMBER.test(chemical.name):
			errorMessage = 'Invalid Name.'
			break
		case !STATE.includes(chemical.state.toLowerCase()):
			errorMessage = 'Invalid State.'
			break
		case !UNIT.includes(chemical.unit):
			errorMessage = 'Invalid Unit.'
			break
		case !NUMBER_REGEX.test(chemical.containerSize):
			errorMessage = 'Invalid Container Size.'
			break
		case !NUMBER_REGEX.test(chemical.amount):
			errorMessage = 'Invalid Amount.'
			break
		case !NUMBER_REGEX.test(chemical.minAmount):
			errorMessage = 'Invalid Minimum Amount.'
			break
		case Number(chemical.amount) > Number(chemical.containerSize):
			errorMessage = 'The Amount should not exceed the Container Size.'
			break
		case Number(chemical.minAmount) > Number(chemical.containerSize):
			errorMessage = 'The Minimum Amount should not exceed the Container Size.'
			break
		case chemical.location !== '' &&
			!NAME_REGEX_WITH_NUMBER.test(chemical.location):
			errorMessage = 'Invalid Location.'
			break
		case chemical.storageGroup !== '' &&
			!STORAGE_GROUPS.includes(chemical.storageGroup.toLowerCase()):
			errorMessage = 'Invalid Storage Group.'
			break
		case chemical.status !== '' &&
			!CHEMICAL_STATUS.includes(chemical.status.toLowerCase()):
			errorMessage = 'Invalid Status.'
			break
		case formatDate(chemical.dateIn).toString() === 'Invalid Date':
			errorMessage = 'Invalid Date In.'
			break
		case chemical.dateOpen !== '' &&
			formatDate(chemical.dateOpen).toString() === 'Invalid Date':
			errorMessage = 'Invalid Date Open.'
			break
		case formatDate(chemical.expirationDate).toString() === 'Invalid Date':
			errorMessage = 'Invalid Expiration Date.'
			break
		case chemical.disposedDate !== '' &&
			formatDate(chemical.disposedDate).toString() === 'Invalid Date':
			errorMessage = 'Invalid Disposed Date.'
			break
		case chemical.supplier !== '' &&
			!NAME_REGEX_WITH_NUMBER.test(chemical.supplier):
			errorMessage = 'Invalid Supplier.'
			break
		case chemical.brand !== '' && !NAME_REGEX_WITH_NUMBER.test(chemical.brand):
			errorMessage = 'Invalid Brand.'
			break
	}

	return errorMessage !== '' ? `Chemical No. ${index + 1}: ` + errorMessage : ''
}

const addChemical = async (
	lab,
	locations,
	CASs,
	chemical,
	index,
	session,
	results
) => {
	try {
		const today = new Date()
		today.setUTCHours(0, 0, 0, 0)

		const CASNo = chemical.CASNo
		const dateIn = formatDate(chemical.dateIn)
		const dateOpen =
			chemical.dateOpen !== '' ? formatDate(chemical.dateOpen) : ''
		const expirationDate = formatDate(chemical.expirationDate)
		const disposedDate =
			chemical.disposedDate !== '' ? formatDate(chemical.disposedDate) : ''

		let status = 'Normal'

		if (disposedDate) {
			status = 'Disposed'
		} else {
			if (Number(chemical.amount) <= Number(chemical.minAmount)) {
				status = 'Low Amount'
			}

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
		}

		const chemicalData = {
			name: chemical.name,
			state: chemical.state,
			unit: chemical.unit,
			containerSize: Number(chemical.containerSize).toFixed(2),
			amount: Number(chemical.amount).toFixed(2),
			minAmount: Number(chemical.minAmount).toFixed(2),
			lab: lab._id,
			storageGroup: chemical.storageGroup,
			status,
			dateIn,
			expirationDate,
			supplier: chemical.supplier,
			brand: chemical.brand,
			notes: chemical.notes,
		}

		if (dateOpen !== '') {
			chemicalData.dateOpen = dateOpen
		}

		const location = locations.find(
			(location) =>
				location.name.toLowerCase() === chemical.location.toLowerCase()
		)

		if (!location) {
			const updatedLab = await Lab.findOneAndUpdate(
				{ _id: lab._id },
				{
					$push: {
						locations: {
							name: chemical.location,
							storageGroups: STORAGE_GROUPS.map((group) => group.toUpperCase()),
						},
					},
					$set: {
						lastUpdated: Date.now(),
					},
				},
				{ new: true, session }
			)

			const newLocation = updatedLab.locations.find(
				(location) =>
					location.name.toLowerCase() === chemical.location.toLowerCase()
			)

			chemicalData.locationId = newLocation._id
			locations.push({ _id: newLocation._id, name: chemical.location })
		} else {
			chemicalData.locationId = location._id
		}

		const foundCAS = CASs.find((CAS) => CAS.CASNo === CASNo)
		if (!foundCAS) {
			let classifications = []
			let COCs = []

			const foundGHSs = GHSLists.find((list) => list.CASNumber.includes(CASNo))

			if (foundGHSs && foundGHSs.pictograms.includes(',')) {
				const GHSs = foundGHSs.pictograms.split(',')

				classifications = GHSs.filter((GHS) =>
					GHS.toLowerCase().includes('ghs')
				).map((GHS) => pictograms[GHS])
			}

			const foundCOCs = COCLists.find((list) => list.CASNumber === CASNo)

			if (foundCOCs) {
				COCs = getKeysByValue(foundCOCs, 1)
			}

			const newCAS = await CAS.create(
				[
					{
						CASNo,
						chemicalName: chemical.name,
						SDS: 'No SDS',
						classifications,
						COCs,
					},
				],
				{ session }
			)

			chemicalData.CASId = newCAS[0]._id
			CASs.push({ _id: newCAS[0]._id, CASNo })
		} else {
			chemicalData.CASId = foundCAS._id
		}

		const newChemical = await Chemical.create([chemicalData], { session })

		const QRCode = await generateQRCode(newChemical[0]._id)

		await Chemical.updateOne(
			newChemical[0],
			{
				$set: {
					QRCode,
				},
			},
			{ session }
		)

		if (disposedDate) {
			await Lab.updateOne(
				lab,
				{
					$push: {
						disposedChemicals: newChemical[0]._id,
					},
					$set: {
						lastUpdated: Date.now(),
					},
				},
				{ session }
			)
		} else {
			await Lab.updateOne(
				lab,
				{
					$push: {
						chemicals: newChemical[0]._id,
					},
					$set: {
						lastUpdated: Date.now(),
					},
				},
				{ session }
			)
		}

		results.new.push({ index, CASNo: chemical.CASNo, name: chemical.name })
	} catch (error) {
		results.failed.push({
			index,
			CASNo: chemical.CASNo,
			name: chemical.name,
			reason: error.message,
		})
		return
	}
}
