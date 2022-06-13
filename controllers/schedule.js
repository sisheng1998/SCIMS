const schedule = require('node-schedule')
const Chemical = require('../models/Chemical')
const User = require('../models/User')
const Lab = require('../models/Lab')
const Subscriber = require('../models/Subscriber')
const Notification = require('../models/Notification')
const settings = require('../config/settings.json')
const ROLES_LIST = require('../config/roles_list')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')
const logEvents = require('../middleware/logEvents')

const notifyUsers = (chemicals, type) => {
	chemicals.forEach(async (chemical) => {
		if (chemical.lab === null) return

		const users = await User.find(
			{
				roles: {
					$elemMatch: {
						lab: { $eq: chemical.lab._id },
						role: { $gte: ROLES_LIST.postgraduate },
						status: { $eq: 'Active' },
					},
				},
			},
			'email'
		)

		users.forEach(async (user) => {
			await User.updateOne(
				{ _id: user._id },
				{
					$set: {
						notification: true,
					},
				}
			)

			await Notification.create({
				lab: chemical.lab._id,
				user: user._id,
				chemical: chemical._id,
				type,
			})

			const emailOptions = {
				to: user.email,
				subject:
					type === 'Expired'
						? 'Alert - Chemical Expired'
						: 'Alert - Chemical Expiring Soon',
				template: type === 'Expired' ? 'expired' : 'expiring_soon',
				context: {
					lab: chemical.lab.labName,
					chemicalName: chemical.name,
					url: `${process.env.DOMAIN_NAME}/inventory/${chemical._id}`,
				},
			}

			sendEmail(emailOptions)
		})

		const subscribers = await Subscriber.find(
			{ user: { $in: users } },
			'endpoint keys'
		)

		subscribers.forEach((subscriber) => {
			const subscription = {
				endpoint: subscriber.endpoint,
				keys: subscriber.keys,
			}

			const payload = JSON.stringify({
				title:
					type === 'Expired'
						? 'Alert - Chemical Expired'
						: 'Alert - Chemical Expiring Soon',
				message:
					type === 'Expired'
						? `[Lab ${chemical.lab.labName}] ${chemical.name} expired.`
						: `[Lab ${chemical.lab.labName}] ${chemical.name} is expiring soon.`,
				url: `/inventory/${chemical._id}`,
			})

			sendNotification(subscription, payload)
		})
	})
}

module.exports = async () => {
	// At 00:15 (UTC) everyday - Update all chemical status
	schedule.scheduleJob('15 8 * * *', async () => {
		const today = new Date()
		const future = new Date(
			new Date().setDate(today.getDate() + settings.DAY_BEFORE_EXP)
		)

		try {
			// Handle expired chemicals
			const expiredChemicals = await Chemical.find(
				{
					status: {
						$nin: ['Disposed', 'Expired'],
					},
					expirationDate: {
						$lt: today,
					},
				},
				'name lab'
			).populate({
				path: 'lab',
				select: 'labName status',
				match: { status: { $eq: 'In Use' } },
			})

			await Chemical.updateMany(
				{
					status: {
						$nin: ['Disposed', 'Expired'],
					},
					expirationDate: {
						$lt: today,
					},
				},
				{
					$set: {
						status: 'Expired',
						lastUpdated: today,
					},
				}
			)

			notifyUsers(expiredChemicals, 'Expired')

			// Handle expiring chemicals
			const expiringChemicals = await Chemical.find(
				{
					status: {
						$nin: ['Expiring Soon', 'Disposed', 'Expired'],
					},
					expirationDate: {
						$lt: future,
					},
				},
				'name lab'
			).populate({
				path: 'lab',
				select: 'labName status',
				match: { status: { $eq: 'In Use' } },
			})

			await Chemical.updateMany(
				{
					status: {
						$nin: ['Expiring Soon', 'Disposed', 'Expired'],
					},
					expirationDate: {
						$lt: future,
					},
				},
				{
					$set: {
						status: 'Expiring Soon',
						lastUpdated: today,
					},
				}
			)

			notifyUsers(expiringChemicals, 'Expiring Soon')
		} catch (error) {
			logEvents(`${error.name}: ${error.message}`, 'scheduleErrorLogs.txt')
		}
	})

	// At 00:30 (UTC) on Monday - Send weekly report to lab owner
	schedule.scheduleJob('30 8 * * 1', async () => {
		const today = new Date()
		const past = new Date(new Date().setDate(today.getDate() - 7))

		const todayDate = today.toLocaleDateString('en-GB')
		const pastDate = past.toLocaleDateString('en-GB')

		try {
			const labs = await Lab.find(
				{
					status: 'In Use',
				},
				'labName labOwner chemicals disposedChemicals'
			)
				.populate('labOwner', 'email')
				.populate({
					path: 'chemicals disposedChemicals',
					select: 'name status CASId createdAt lastUpdated',
					match: {
						lastUpdated: {
							$gte: past,
							$lt: today,
						},
					},
					populate: {
						path: 'CASId',
						select: 'CASNo',
					},
				})
				.lean()

			labs.forEach((lab) => {
				const newChemicals = lab.chemicals.filter(
					(chemical) => chemical.createdAt >= past && chemical.createdAt < today
				)

				const lowAmountChemicals = lab.chemicals.filter(
					(chemical) => chemical.status === 'Low Amount'
				)

				const expiringChemicals = lab.chemicals.filter(
					(chemical) => chemical.status === 'Expiring Soon'
				)

				const expiredChemicals = lab.chemicals.filter(
					(chemical) => chemical.status === 'Expired'
				)

				const disposedChemicals = lab.disposedChemicals

				const emailOptions = {
					to: lab.labOwner.email,
					subject: `SCIMS Weekly Report (${todayDate})`,
					template: 'weekly_report',
					context: {
						todayDate,
						pastDate,
						lab: lab.labName,
						newChemicals,
						lowAmountChemicals,
						expiringChemicals,
						expiredChemicals,
						disposedChemicals,
					},
				}

				sendEmail(emailOptions)
			})
		} catch (error) {
			logEvents(`${error.name}: ${error.message}`, 'scheduleErrorLogs.txt')
		}
	})
}
