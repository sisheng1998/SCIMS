const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')
const { uploadTicketAttachments } = require('../middleware/uploadFile')
const { openTicket } = require('../controllers/ticket')

router
  .route('/')
  .post(
    verifyRoles(ROLES_LIST.guest),
    uploadTicketAttachments.array('attachments'),
    openTicket
  )

module.exports = router
