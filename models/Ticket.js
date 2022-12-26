const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ROLES_LIST = require('../config/roles_list')

const TicketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lab: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: ROLES_LIST.undergraduate,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachments: [String],
    replies: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        message: String,
        attachments: [String],
        createdAt: {
          type: Date,
          immutable: true,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      default: 'Open', // Open / In Progress / Resolved
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'tickets' }
)

const Ticket = mongoose.model('Ticket', TicketSchema)

module.exports = Ticket
