const nodemailer = require('nodemailer')
const settings = require('../config/settings.json')
const logEvents = require('../middleware/logEvents')

const sendEmail = (options) => {
	const EMAIL_FROM = `${
		options.FROM_NAME ? options.FROM_NAME : settings.FROM_NAME
	} <${options.FROM_EMAIL ? options.FROM_EMAIL : settings.FROM_EMAIL}>`

	const transporter = nodemailer.createTransport({
		host: options.EMAIL_HOST ? options.EMAIL_HOST : settings.EMAIL_HOST,
		port: options.EMAIL_PORT ? options.EMAIL_PORT : settings.EMAIL_PORT,
		secure:
			(options.EMAIL_PORT ? options.EMAIL_PORT : settings.EMAIL_PORT) === 465
				? true
				: false,
		auth: {
			user: options.EMAIL_USERNAME
				? options.EMAIL_USERNAME
				: settings.EMAIL_USERNAME,
			pass: options.EMAIL_PASSWORD
				? options.EMAIL_PASSWORD
				: settings.EMAIL_PASSWORD,
		},
	})

	const mailOptions = {
		from: EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.text,
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error)
			logEvents(
				`${error.name}: ${error.message}${
					error.port ? ' at Port ' + error.port : ''
				}`,
				'emailErrorLogs.txt'
			)
	})
}

module.exports = sendEmail
