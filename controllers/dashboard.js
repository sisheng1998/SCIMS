const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Chemical = require('../models/Chemical')
const Lab = require('../models/Lab')
const Config = require('../models/Config')

// Dashboard
exports.getInfo = async (req, res, next) => {
	const { labId } = req.body

	if (!labId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	const config = await Config.findOne({}, '-_id')

	const today = new Date()
	const past = new Date(today.setDate(today.getDate() - 30))

	const data = {
		totalUsers: 0,
		newUsers: 0,
		pendingUsers: 0,
		totalChemicals: 0,
		newChemicals: 0,
		lowAmountChemicals: 0,
		expiringChemicals: 0,
		expiredChemicals: 0,
		disposedChemicals: 0,
		chemicals: [],
		dayBeforeExp: config.DAY_BEFORE_EXP,
	}

	try {
		if (labId === 'All Labs') {
			const labs = req.user.roles.map((role) => {
				if (role.status === 'Active') return role.lab
			})

			const foundLabs = await Lab.find(
				{
					_id: {
						$in: labs,
					},
					status: 'In Use',
				},
				'chemicals disposedChemicals'
			).populate('chemicals disposedChemicals', 'name expirationDate')

			if (foundLabs.length === 0) {
				return next(new ErrorResponse('Lab not found.', 404))
			}

			data.totalUsers = await User.countDocuments({
				roles: {
					$elemMatch: {
						lab: {
							$in: foundLabs,
						},
					},
				},
			})
			data.newUsers = await User.countDocuments({
				roles: {
					$elemMatch: {
						lab: {
							$in: foundLabs,
						},
					},
				},
				createdAt: { $gte: past },
			})
			data.pendingUsers = await User.countDocuments({
				roles: {
					$elemMatch: {
						lab: {
							$in: foundLabs,
						},
						status: 'Pending',
					},
				},
			})

			data.totalChemicals = await Chemical.countDocuments({
				lab: {
					$in: foundLabs,
				},
			})
			data.newChemicals = await Chemical.countDocuments({
				lab: {
					$in: foundLabs,
				},
				createdAt: { $gte: past },
			})
			data.lowAmountChemicals = await Chemical.countDocuments({
				lab: {
					$in: foundLabs,
				},
				status: 'Low Amount',
			})
			data.expiringChemicals = await Chemical.countDocuments({
				lab: {
					$in: foundLabs,
				},
				status: 'Expiring Soon',
			})
			data.expiredChemicals = await Chemical.countDocuments({
				lab: {
					$in: foundLabs,
				},
				status: 'Expired',
			})
			data.disposedChemicals = await Chemical.countDocuments({
				lab: {
					$in: foundLabs,
				},
				status: 'Disposed',
			})

			foundLabs.forEach(
				(lab) =>
					(data.chemicals = [
						...data.chemicals,
						...lab.chemicals,
						...lab.disposedChemicals,
					])
			)
		} else {
			const foundLab = await Lab.findById(
				labId,
				'chemicals disposedChemicals'
			).populate('chemicals disposedChemicals', 'name expirationDate')

			if (!foundLab) {
				return next(new ErrorResponse('Lab not found.', 404))
			}

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
		}

		res.status(200).json({
			success: true,
			data,
		})
	} catch (error) {
		next(error)
	}
}
