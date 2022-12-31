const express = require('express')
const router = express.Router()

const { uploadTicketAttachments } = require('../middleware/uploadFile')
const {
  getTickets,
  openTicket,
  getTicketDetails,
  updateStatus,
} = require('../controllers/support')

router.route('/tickets').get(getTickets)
router
  .route('/new-ticket')
  .post(uploadTicketAttachments.array('attachments'), openTicket)
router.route('/ticket/:ticketId').get(getTicketDetails)
router.route('/ticket/:ticketId/status').patch(updateStatus)

module.exports = router
