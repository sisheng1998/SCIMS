const express = require('express')
const router = express.Router()

const { uploadTicketAttachments } = require('../middleware/uploadFile')
const {
  getTickets,
  openTicket,
  getTicketDetails,
  updateTicket,
  addMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/support')

router.route('/tickets').get(getTickets)
router
  .route('/new-ticket')
  .post(uploadTicketAttachments.array('attachments'), openTicket)
router.route('/ticket/:ticketId').get(getTicketDetails)
router.route('/ticket/:ticketId').patch(updateTicket)

router
  .route('/ticket/:ticketId/new-message')
  .post(uploadTicketAttachments.array('attachments'), addMessage)
router.route('/ticket/:ticketId/message/:messageId').patch(updateMessage)
router.route('/ticket/:ticketId/message/:messageId').delete(deleteMessage)

module.exports = router
