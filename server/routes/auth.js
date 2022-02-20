const express = require('express')
const router = express.Router()

const {
	register,
	emailVerification,
	sendEmailVerification,
	login,
	logout,
	forgotPassword,
	resetPassword,
	refreshToken,
	labs,
	emails,
	applyNewLab,
} = require('../controllers/auth')

router.route('/register').post(register)
router.route('/verify-email/:emailVerificationToken').put(emailVerification)
router.route('/verify-email').put(sendEmailVerification)
router.route('/login').post(login)
router.route('/logout').put(logout)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').put(resetPassword)
router.route('/refresh-token').get(refreshToken)
router.route('/labs').get(labs)
router.route('/emails').get(emails)
router.route('/apply-new-lab').put(applyNewLab)

module.exports = router
