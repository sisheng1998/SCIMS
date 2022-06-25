const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const { startSession } = require('mongoose')
const settings = require('../config/settings.json')

exports.importChemicals = async (req, res, next) => {
	const { labId, chemicals } = req.body

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

		chemicals.every(async (chemical, index) => {
			let status = 'Normal'
			if (Number(chemical.amount) <= Number(chemical.minAmount)) {
				status = 'Low Amount'
			}

			const today = new Date()
			today.setUTCHours(0, 0, 0, 0)
			if (new Date(chemical.expirationDate) < today) {
				status = 'Expired'
			} else {
				const future = new Date(
					today.setDate(today.getDate() + settings.DAY_BEFORE_EXP)
				)
				if (new Date(chemical.expirationDate) < future) {
					status = 'Expiring Soon'
				}
			}

			return true
		})

		if (errorMessage) {
			await session.abortTransaction()
			session.endSession()

			res.status(409).json({
				success: false,
				error: errorMessage,
			})
		} else {
			await session.commitTransaction()
			session.endSession()

			res.status(200).json({
				success: true,
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
