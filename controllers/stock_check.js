const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')

exports.stockCheck = async (req, res, next) => {
	const { labId, chemicals } = req.body

	if (!labId || !chemicals) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		res.status(200).json({
			success: true,
			data: 'Records saved.',
		})
	} catch (error) {
		next(error)
	}
}
