const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')

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
