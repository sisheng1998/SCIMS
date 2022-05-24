const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const StockCheck = require('../models/StockCheck')
const { startSession } = require('mongoose')

exports.stockCheck = async (req, res, next) => {
	const { labId, chemicals, missingChemicals, disposedChemicals } = req.body

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

		await StockCheck.create(
			[
				{
					lab: foundLab._id,
					recordedChemicals: chemicals,
					missingChemicals,
					disposedChemicals,
				},
			],
			{ session }
		)

		await session.commitTransaction()
		session.endSession()

		res.status(200).json({
			success: true,
			data: 'Records saved.',
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		next(error)
	}
}
