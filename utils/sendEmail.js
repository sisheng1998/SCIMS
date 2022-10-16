const nodemailer = require('nodemailer')
const Config = require('../models/Config')
const logEvents = require('../middleware/logEvents')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const sendEmail = async (options) => {
  const settings = await Config.findOne({}, '-_id')

  const EMAIL_FROM = `${
    options.FROM_NAME ? options.FROM_NAME : settings.FROM_NAME
  } <${options.FROM_EMAIL ? options.FROM_EMAIL : settings.FROM_EMAIL}>`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: options.EMAIL_USERNAME
        ? options.EMAIL_USERNAME
        : settings.EMAIL_USERNAME,
      pass: options.EMAIL_PASSWORD
        ? options.EMAIL_PASSWORD
        : settings.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve(__dirname, '../emails'),
        layoutsDir: path.resolve(__dirname, '../emails'),
        defaultLayout: 'template.hbs',
      },
      viewPath: path.resolve(__dirname, '../emails'),
      extName: '.hbs',
    })
  )

  const mailOptions = {
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    template: options.template,
    context: options.context,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      logEvents(
        `${error.name}: ${error.message}${
          error.port ? ' at Port ' + error.port : ''
        }`,
        'emailErrorLogs.txt'
      )
    else logEvents(JSON.stringify(info), 'emailSenderLogs.txt')
  })
}

module.exports = sendEmail
