const schedule = require('node-schedule')
const Chemical = require('../models/Chemical')
const settings = require('../config/settings.json')
const sendEmail = require('../utils/sendEmail')

module.exports = () => {
	// At 00:00 everyday - Update all chemical status
	schedule.scheduleJob('0 0 * * *', async () => {
		const today = new Date()
		const future = new Date(
			new Date().setDate(today.getDate() + settings.DAY_BEFORE_EXP)
		)

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
	})

	// At 08:00 on Monday - Send weekly report to lab owner
	schedule.scheduleJob('0 8 * * 5', async () => {
		const message = `
			<p>This email should be received at Friday morning 8am.</p>
		`

		await sendEmail({
			to: 'sisheng1998@gmail.com',
			subject: '[SCIMS] Email Test 2',
			text: message,
		})
	})
}
