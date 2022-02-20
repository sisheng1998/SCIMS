const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')

const {
	getUsers,
	addUser,
	updateUser,
	removeUser,
} = require('../controllers/user')

// Users
router.route('/users').post(verifyRoles(ROLES_LIST.viewer), getUsers)
router.route('/user').post(verifyRoles(ROLES_LIST.labOwner), addUser)
router.route('/user').put(verifyRoles(ROLES_LIST.labOwner), updateUser)
router.route('/user').delete(verifyRoles(ROLES_LIST.labOwner), removeUser)

module.exports = router
