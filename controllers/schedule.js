const schedule = require('node-schedule')
const Chemical = require('../models/Chemical')
const User = require('../models/User')
const Subscriber = require('../models/Subscriber')
const settings = require('../config/settings.json')
const ROLES_LIST = require('../config/roles_list')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')

module.exports = async () => {
	// At 00:00 everyday - Update all chemical status
	schedule.scheduleJob('0 0 * * *', async () => {
		const today = new Date()
		const future = new Date(
			new Date().setDate(today.getDate() + settings.DAY_BEFORE_EXP)
		)

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
				},
			}
		)

		expiredChemicals.forEach(async (chemical) => {
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

			users.forEach((user) => {
				sendEmail({
					to: user.email,
					subject: 'Alert - Chemical Expired',
					template: 'expired',
					context: {
						lab: chemical.lab.labName,
						chemicalName: chemical.name,
						url: `${process.env.DOMAIN_NAME}/inventory/${chemical._id}`,
					},
				})
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
					title: 'Alert - Chemical Expired',
					message: `[Lab ${chemical.lab.labName}] ${chemical.name} expired.`,
					url: `/inventory/${chemical._id}`,
				})

				sendNotification(subscription, payload)
			})
		})

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
				},
			}
		)

		expiringChemicals.forEach(async (chemical) => {
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

			users.forEach((user) => {
				sendEmail({
					to: user.email,
					subject: 'Alert - Chemical Expiring Soon',
					template: 'expiring_soon',
					context: {
						lab: chemical.lab.labName,
						chemicalName: chemical.name,
						url: `${process.env.DOMAIN_NAME}/inventory/${chemical._id}`,
					},
				})
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
					title: 'Alert - Chemical Expiring Soon',
					message: `[Lab ${chemical.lab.labName}] ${chemical.name} expiring soon.`,
					url: `/inventory/${chemical._id}`,
				})

				sendNotification(subscription, payload)
			})
		})
	})

	// At 08:00 on Monday - Send weekly report to lab owner
	/*schedule.scheduleJob('0 8 * * 1', async () => {
		sendEmail({
			to: 'sisheng1998@gmail.com',
			subject: 'Weekly Report',
			template: 'weekly_report',
			context: {},
		})
	})*/
}
