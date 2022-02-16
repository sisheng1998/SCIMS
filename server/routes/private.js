const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')

const { getUsers } = require('../controllers/private')

// Users
router.route('/users').post(verifyRoles(ROLES_LIST.viewer), getUsers)

module.exports = router
