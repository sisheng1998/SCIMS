const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

exports.auth = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization']

		if (!authHeader) {
			return next(new ErrorResponse('Unauthorized to access.', 401))
		}

		const accessToken = authHeader.split(' ')[1]

		if (!accessToken) {
			return next(new ErrorResponse('Unauthorized to access.', 401))
		}

		const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)

		const user = await User.findById(decoded.id)

		if (!user) {
			return next(new ErrorResponse('User not found.', 404))
		}

		req.user = user

		next()
	} catch (err) {
		return next(new ErrorResponse('Unauthorized to access.', 401))
	}
}
