const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')

const {
	getInfo,
	getUsers,
	getLabs,
	addLab,
	addLabWithExistingUser,
	updateLab,
	removeLab,
	getSettings,
	updateSettings,
	sendTestEmail,
} = require('../controllers/admin')

// Dashboard
router.route('/dashboard').put(verifyRoles(ROLES_LIST.admin), getInfo)

// Users
router.route('/users').get(verifyRoles(ROLES_LIST.admin), getUsers)

// Labs
router.route('/labs').get(verifyRoles(ROLES_LIST.admin), getLabs)
router.route('/lab').post(verifyRoles(ROLES_LIST.admin), addLab)
router
	.route('/lab-existing-user')
	.post(verifyRoles(ROLES_LIST.admin), addLabWithExistingUser)
router.route('/lab').put(verifyRoles(ROLES_LIST.admin), updateLab)
router.route('/lab').delete(verifyRoles(ROLES_LIST.admin), removeLab)

// Setting
router.route('/settings').get(verifyRoles(ROLES_LIST.admin), getSettings)
router.route('/settings').put(verifyRoles(ROLES_LIST.admin), updateSettings)
router
	.route('/settings/test-email')
	.put(verifyRoles(ROLES_LIST.admin), sendTestEmail)

module.exports = router
