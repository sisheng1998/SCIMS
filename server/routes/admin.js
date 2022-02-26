const express = require('express')
const router = express.Router()

const { getUsers, getLabs } = require('../controllers/admin')

// Users
router.route('/users').get(getUsers)

// Labs
router.route('/labs').get(getLabs)

module.exports = router
