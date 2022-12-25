const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')
const { uploadTicketAttachments } = require('../middleware/uploadFile')
const { getTickets, openTicket } = require('../controllers/support')

router.route('/tickets').get(verifyRoles(ROLES_LIST.guest), getTickets)
router
  .route('/new-ticket')
  .post(
    verifyRoles(ROLES_LIST.guest),
    uploadTicketAttachments.array('attachments'),
    openTicket
  )

module.exports = router
