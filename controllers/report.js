const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Usage = require('../models/Usage')
const StockCheck = require('../models/StockCheck')
const ObjectId = require('mongoose').Types.ObjectId

const UserOption = 'name email avatar'
const ChemicalOption = 'CASId name'

exports.usageReports = async (req, res, next) => {
	const { labId, dateRanges } = req.body

	if (!labId || !dateRanges) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const startDate = new Date(dateRanges.start)
		startDate.setUTCHours(0, 0, 0, 0)

		const endDate = new Date(dateRanges.end)
		endDate.setUTCHours(23, 59, 59, 999)

		const records = await Usage.find(
			{ lab: labId, date: { $gte: startDate, $lt: endDate } },
			'-lab'
		)
			.populate('user', UserOption)
			.populate({
				path: 'chemical',
				select: ChemicalOption,
				populate: {
					path: 'CASId',
					model: 'CAS',
					select: 'CASNo chemicalName -_id',
				},
			})

		res.status(200).json({
			success: true,
			data: records,
		})
	} catch (error) {
		next(error)
	}
}

exports.stockCheckReports = async (req, res, next) => {
	const { labId } = req.body

	if (!labId) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const records = await StockCheck.find({ lab: labId })

		res.status(200).json({
			success: true,
			data: records,
		})
	} catch (error) {
		next(error)
	}
}

exports.stockCheckReport = async (req, res, next) => {
	const reportId = ObjectId(req.params.reportId)
	const { labId } = req.body

	if (!labId || !reportId) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	const foundLab = await Lab.findById(labId)
	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	try {
		const foundReport = await StockCheck.findOne({
			_id: reportId,
			lab: foundLab._id,
		}).populate('lab', 'labName')

		if (!foundReport) {
			return next(new ErrorResponse('Report not found.', 404))
		}

		res.status(201).json({
			success: true,
			data: foundReport,
		})
	} catch (error) {
		next(error)
	}
}
