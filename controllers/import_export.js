const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')

exports.exportChemicals = async (req, res, next) => {
	const { labId, columns, statuses } = req.body

	if (!labId || !columns || !statuses) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundLab = await Lab.findById(labId, 'locations._id locations.name')

	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	try {
		const chemicalOptions = columns.join(' ')

		const chemicals = await Chemical.find(
			{
				lab: foundLab._id,
				status: {
					$in: statuses,
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
