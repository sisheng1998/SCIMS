const express = require('express')
const router = express.Router()

const {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	refreshToken,
} = require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').put(logout)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').put(resetPassword)
router.route('/refresh-token').get(refreshToken)

module.exports = router
