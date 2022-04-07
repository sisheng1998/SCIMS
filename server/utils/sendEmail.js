const nodemailer = require('nodemailer')
const settings = require('../config/settings.json')

const sendEmail = (options) => {
	const transporter = nodemailer.createTransport({
		host: settings.EMAIL_HOST,
		port: settings.EMAIL_PORT,
		secure: settings.EMAIL_SECURE,
		auth: {
			user: settings.EMAIL_USERNAME,
			pass: settings.EMAIL_PASSWORD,
		},
	})

	const mailOptions = {
		from: settings.EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.text,
	}

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err)
		} else {
			console.log(info)
		}
	})
}

module.exports = sendEmail
