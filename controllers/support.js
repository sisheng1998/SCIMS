const { startSession } = require('mongoose')
const Lab = require('../models/Lab')
const Ticket = require('../models/Ticket')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const ROLES_LIST = require('../config/roles_list')
const ObjectId = require('mongoose').Types.ObjectId

const PIC_EMAIL = 'sisheng1998@gmail.com'

exports.getTickets = async (req, res, next) => {
  const user = req.user
  const isAdmin = user.isAdmin

  const TICKET_OPTIONS = 'user subject status createdAt lastUpdated'
  const USER_OPTIONS = 'name email avatar'

  const tickets = {
    active: [],
    resolved: [],
  }

  try {
    const activeTickets = isAdmin
      ? await Ticket.find(
          {
            status: {
              $ne: 'Resolved',
            },
          },
          TICKET_OPTIONS
        )
          .populate('user', USER_OPTIONS)
          .sort({ createdAt: -1 })
      : await Ticket.find(
          {
            user: user._id,
            status: {
              $ne: 'Resolved',
            },
          },
          TICKET_OPTIONS
        )
          .populate('user', USER_OPTIONS)
          .sort({ createdAt: -1 })

    const resolvedTickets = isAdmin
      ? await Ticket.find(
          {
            status: 'Resolved',
          },
          TICKET_OPTIONS
        )
          .populate('user', USER_OPTIONS)
          .sort({ createdAt: -1 })
      : await Ticket.find(
          {
            user: user._id,
            status: 'Resolved',
          },
          TICKET_OPTIONS
        )
          .populate('user', USER_OPTIONS)
          .sort({ createdAt: -1 })

    tickets.active = activeTickets.map((ticket, index) => ({
      index,
      userName: ticket.user.name,
      userEmail: ticket.user.email,
      ...ticket._doc,
    }))
    tickets.resolved = resolvedTickets.map((ticket, index) => ({
      index,
      userName: ticket.user.name,
      userEmail: ticket.user.email,
      ...ticket._doc,
    }))

    res.status(200).json({
      success: true,
      tickets,
    })
  } catch (error) {
    return next(error)
  }
}

exports.openTicket = async (req, res, next) => {
  const { labId, role, subject, message, deviceInfo } = JSON.parse(
    req.body.ticketInfo
  )

  if (!labId || !subject || !message) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  if (labId !== 'All Labs' && labId !== ROLES_LIST.admin.toString()) {
    const foundLab = await Lab.findById(labId)
    if (!foundLab) {
      return next(new ErrorResponse('Lab not found.', 404))
    }
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const newTicket = await Ticket.create(
      [
        {
          user: req.user._id,
          lab: labId,
          role,
          subject,
          message,
          attachments: req.files.map((file) => file.filename),
          deviceInfo,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'New ticket opened.',
      ticketId: newTicket[0]._id,
    })

    sendEmail({
      to: PIC_EMAIL,
      subject: 'New Support Ticket',
      template: 'new_support_ticket',
      context: {
        subject,
        message,
        ticketId: newTicket[0]._id,
        url: `${process.env.DOMAIN_NAME}/support/${newTicket[0]._id}`,
      },
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.getTicketDetails = async (req, res, next) => {
  const ticketId = ObjectId(req.params.ticketId)

  const USER_OPTIONS = 'name email avatar'

  try {
    const foundTicket = await Ticket.findOne({
      _id: ticketId,
    }).populate('user', USER_OPTIONS)

    if (!foundTicket) {
      return next(new ErrorResponse('Ticket not found.', 404))
    } else if (
      !req.user.isAdmin &&
      !foundTicket.user._id.equals(req.user._id)
    ) {
      return next(new ErrorResponse('Unauthorized.', 401))
    }

    res.status(200).json({
      success: true,
      ticket: foundTicket,
    })
  } catch (error) {
    next(error)
  }
}
