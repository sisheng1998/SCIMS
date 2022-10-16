const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

exports.verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return next(new ErrorResponse('Unauthorized to access.', 401))
    }

    const accessToken = authHeader.split(' ')[1]

    if (!accessToken) {
      return next(new ErrorResponse('Access token not found.', 404))
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)

    const user = await User.findById(decoded.id)

    if (!user) {
      return next(new ErrorResponse('User not found.', 404))
    }

    req.user = user
    next()
  } catch (err) {
    return next(new ErrorResponse('Invalid access token.', 403))
  }
}
