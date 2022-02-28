const express = require('express')
const router = express.Router()

const {
	getUsers,
	getLabs,
	addLab,
	addLabWithExistingUser,
	updateLab,
	removeLab,
} = require('../controllers/admin')

// Users
router.route('/users').get(getUsers)

// Labs
router.route('/labs').get(getLabs)
router.route('/lab').post(addLab)
router.route('/lab-existing-user').post(addLabWithExistingUser)
router.route('/lab').put(updateLab)
router.route('/lab').delete(removeLab)

module.exports = router
