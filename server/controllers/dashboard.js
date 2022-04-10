const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Chemical = require('../models/Chemical')

const days = 90

// Dashboard
exports.getInfo = async (req, res, next) => {
	const { labId } = req.body

	if (!labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	try {
		const today = new Date()
		const past = new Date(today.setDate(today.getDate() - days))

		const data = {}

		data.totalUsers = await User.countDocuments({
			roles: { $elemMatch: { lab: labId } },
		})
		data.newUsers = await User.countDocuments({
			roles: { $elemMatch: { lab: labId } },
			createdAt: { $gte: past },
		})
		data.pendingUsers = await User.countDocuments({
			roles: { $elemMatch: { lab: labId, status: 'Pending' } },
			lastUpdated: { $gte: past },
		})

		data.totalChemicals = await Chemical.countDocuments({
			lab: { $eq: labId },
		})
		data.newChemicals = await Chemical.countDocuments({
			lab: { $eq: labId },
			createdAt: { $gte: past },
		})
		data.lowAmountChemicals = await Chemical.countDocuments({
			lab: { $eq: labId },
			status: { $eq: 'Low Amount' },
			lastUpdated: { $gte: past },
		})
		data.expiringChemicals = await Chemical.countDocuments({
			lab: { $eq: labId },
			status: { $eq: 'Expiring Soon' },
			lastUpdated: { $gte: past },
		})
		data.expiredChemicals = await Chemical.countDocuments({
			lab: { $eq: labId },
			status: { $eq: 'Expired' },
			lastUpdated: { $gte: past },
		})
		data.disposedChemicals = await Chemical.countDocuments({
			lab: { $eq: labId },
			status: { $eq: 'Disposed' },
			lastUpdated: { $gte: past },
		})

		res.status(200).json({
			success: true,
			data,
		})
	} catch (error) {
		next(error)
	}
}
