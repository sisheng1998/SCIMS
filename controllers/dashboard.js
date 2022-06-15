const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Chemical = require('../models/Chemical')
const Lab = require('../models/Lab')
const settings = require('../config/settings.json')

// Dashboard
exports.getInfo = async (req, res, next) => {
	const { labId } = req.body

	if (!labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	const foundLab = await Lab.findById(
		labId,
		'chemicals disposedChemicals'
	).populate('chemicals disposedChemicals', 'name expirationDate')

	if (!foundLab) {
		return next(new ErrorResponse('Lab not found.', 404))
	}

	try {
		const today = new Date()
		const past = new Date(today.setDate(today.getDate() - 30))

		const data = {}

		data.totalUsers = await User.countDocuments({
			roles: { $elemMatch: { lab: foundLab._id } },
		})
		data.newUsers = await User.countDocuments({
			roles: { $elemMatch: { lab: foundLab._id } },
			createdAt: { $gte: past },
		})
		data.pendingUsers = await User.countDocuments({
			roles: { $elemMatch: { lab: foundLab._id, status: 'Pending' } },
		})

		data.totalChemicals = await Chemical.countDocuments({
			lab: foundLab._id,
		})
		data.newChemicals = await Chemical.countDocuments({
			lab: foundLab._id,
			createdAt: { $gte: past },
		})
		data.lowAmountChemicals = await Chemical.countDocuments({
			lab: foundLab._id,
			status: 'Low Amount',
		})
		data.expiringChemicals = await Chemical.countDocuments({
			lab: foundLab._id,
			status: 'Expiring Soon',
		})
		data.expiredChemicals = await Chemical.countDocuments({
			lab: foundLab._id,
			status: 'Expired',
		})
		data.disposedChemicals = await Chemical.countDocuments({
			lab: foundLab._id,
			status: 'Disposed',
		})

		data.chemicals = [...foundLab.chemicals, ...foundLab.disposedChemicals]
		data.dayBeforeExp = settings.DAY_BEFORE_EXP

		res.status(200).json({
			success: true,
			data,
		})
	} catch (error) {
		next(error)
	}
}
