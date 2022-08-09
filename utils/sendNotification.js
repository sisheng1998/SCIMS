const webPush = require('web-push')
const keys = require('../config/vapidKeys.json')
const logEvents = require('../middleware/logEvents')

webPush.setVapidDetails(
	process.env.DOMAIN_NAME,
	keys.PUBLIC_KEY,
	keys.PRIVATE_KEY
)

const sendNotification = (subscription, payload) => {
	webPush
		.sendNotification(subscription, payload)
		.catch((error) =>
			logEvents(
				`${error.name}: ${error.message}`,
				'pushNotificationErrorLogs.txt'
			)
		)
}

module.exports = sendNotification
