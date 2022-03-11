const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')

const {
	getUsers,
	addUser,
	updateUser,
	removeUser,
	addExistingUser,
} = require('../controllers/user')

const { getProfile } = require('../controllers/profile')

// Users
router.route('/users').post(verifyRoles(ROLES_LIST.guest), getUsers)
router.route('/user').post(verifyRoles(ROLES_LIST.labOwner), addUser)
router
	.route('/existing-user')
	.post(verifyRoles(ROLES_LIST.labOwner), addExistingUser)
router.route('/user').put(verifyRoles(ROLES_LIST.labOwner), updateUser)
router.route('/user').delete(verifyRoles(ROLES_LIST.labOwner), removeUser)

// Profile
router.route('/profile').get(getProfile)

module.exports = router
