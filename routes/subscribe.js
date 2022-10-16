const express = require('express')
const router = express.Router()

const { subscribe, unsubscribe } = require('../controllers/subscribe')

// Mobile Push Notification
router.route('/').post(subscribe)
router.route('/').delete(unsubscribe)

module.exports = router
