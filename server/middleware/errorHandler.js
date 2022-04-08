const ErrorResponse = require('../utils/errorResponse')
const logEvents = require('./logEvents')

const errorHandler = (err, req, res, next) => {
	if (err.message !== 'Invalid access token.') {
		logEvents(`${err.name}: ${err.message}`, 'errorLogs.txt')
		logEvents(
			`${req.method} ${req.headers.origin} ${req.url}`,
			'requestLogs.txt'
		)
	}

	let error = { ...err }

	error.message = err.message

	if (err.code === 11000) {
		const message = 'Duplicate field value.'
		error = new ErrorResponse(message, 400)
	}

	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message)
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server error.',
	})
}

module.exports = errorHandler
