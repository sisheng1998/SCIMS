const express = require('express')
const router = express.Router()

const { getUsers, getLabs, updateLab } = require('../controllers/admin')

// Users
router.route('/users').get(getUsers)

// Labs
router.route('/labs').get(getLabs)
router.route('/lab').put(updateLab)

module.exports = router
