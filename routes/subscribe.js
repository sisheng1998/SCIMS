const express = require('express')
const router = express.Router()

const { subscribe, unsubscribe } = require('../controllers/subscribe')

router.route('/').post(subscribe)
router.route('/').delete(unsubscribe)

module.exports = router
