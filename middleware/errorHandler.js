const ErrorResponse = require('../utils/errorResponse')
const logEvents = require('./logEvents')

const errorHandler = (err, req, res, next) => {
  if (
    err.message !== 'Invalid access token.' &&
    err.message !== 'CAS not found.' &&
    err.message !== 'Chemical not found.'
  ) {
    logEvents(
      `${req.method} ${req.url} - ${err.name}: ${err.message}`,
      'logs.txt'
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
