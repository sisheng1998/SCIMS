const express = require('express')
const router = express.Router()
const { getPrivateData } = require('../controllers/private')
const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')

router.route('/').get(verifyRoles(ROLES_LIST.viewer), getPrivateData)

module.exports = router
