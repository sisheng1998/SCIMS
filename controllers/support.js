const { startSession } = require('mongoose')
const Lab = require('../models/Lab')
const Ticket = require('../models/Ticket')
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
          messages: [
            {
              user: req.user._id,
              message,
              attachments: req.files.map((file) => file.filename),
            },
          ],
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
      template: 'support_ticket',
      context: {
        newTicket: true,
        subject,
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
    const foundTicket = await Ticket.findById(ticketId)
      .populate('user', USER_OPTIONS)
      .populate('messages.user', USER_OPTIONS)

    if (!foundTicket) {
      return next(new ErrorResponse('Ticket not found.', 404))
    } else if (
      !req.user.isAdmin &&
      !foundTicket.user._id.equals(req.user._id)
    ) {
      return next(new ErrorResponse('Unauthorized.', 401))
    }

    let labName = ''

    if (
      foundTicket.lab !== 'All Labs' &&
      foundTicket.lab !== ROLES_LIST.admin.toString()
    ) {
      const foundLab = await Lab.findById(foundTicket.lab, 'labName')

      if (!foundLab) {
        return next(new ErrorResponse('Lab not found.', 404))
      }

      labName = `Lab ${foundLab.labName}`
    } else if (foundTicket.lab === ROLES_LIST.admin.toString()) {
      labName = 'Admin'
    } else {
      labName = foundTicket.lab
    }

    res.status(200).json({
      success: true,
      ticket: {
        ...foundTicket._doc,
        labName,
        attachmentPath: '/public/tickets/',
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.updateTicket = async (req, res, next) => {
  const ticketId = ObjectId(req.params.ticketId)

  const { subject, status } = req.body

  const session = await startSession()

  try {
    session.startTransaction()

    const foundTicket = await Ticket.findById(ticketId)
    if (!foundTicket) {
      return next(new ErrorResponse('Ticket not found.', 404))
    }

    const updateQuery = {
      lastUpdated: Date.now(),
    }

    if (subject && subject !== foundTicket.subject) {
      updateQuery.subject = subject
    }

    if (status && status !== foundTicket.status) {
      updateQuery.status = status
    }

    await Ticket.updateOne(
      { _id: foundTicket._id },
      {
        $set: updateQuery,
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(204).json({
      success: true,
      data: 'Ticket updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.addMessage = async (req, res, next) => {
  const ticketId = ObjectId(req.params.ticketId)

  const { message } = JSON.parse(req.body.message)

  const session = await startSession()

  try {
    session.startTransaction()

    const foundTicket = await Ticket.findById(ticketId).populate(
      'user',
      'email'
    )
    if (!foundTicket) {
      return next(new ErrorResponse('Ticket not found.', 404))
    }

    await Ticket.updateOne(
      { _id: foundTicket._id },
      {
        $push: {
          messages: {
            user: req.user._id,
            message,
            attachments: req.files.map((file) => file.filename),
          },
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'Message added.',
    })

    const toEmail = foundTicket.user._id.equals(req.user._id)
      ? PIC_EMAIL
      : foundTicket.user.email

    sendEmail({
      to: toEmail,
      subject: 'New Support Ticket Message',
      template: 'support_ticket',
      context: {
        newTicket: false,
        subject: foundTicket.subject,
        ticketId: foundTicket._id,
        url: `${process.env.DOMAIN_NAME}/support/${foundTicket._id}`,
      },
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.updateMessage = async (req, res, next) => {
  const ticketId = ObjectId(req.params.ticketId)
  const messageId = ObjectId(req.params.messageId)

  const { message } = req.body

  if (!message) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const foundTicket = await Ticket.findById(ticketId)
    if (!foundTicket) {
      return next(new ErrorResponse('Ticket not found.', 404))
    }

    await Ticket.updateOne(
      { _id: foundTicket._id, 'messages._id': messageId },
      {
        $set: {
          'messages.$.message': message,
          'messages.$.lastUpdated': Date.now(),
          lastUpdated: Date.now(),
        },
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(204).json({
      success: true,
      data: 'Message updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.deleteMessage = async (req, res, next) => {
  const ticketId = ObjectId(req.params.ticketId)
  const messageId = ObjectId(req.params.messageId)

  const session = await startSession()

  try {
    session.startTransaction()

    const foundTicket = await Ticket.findById(ticketId)
    if (!foundTicket) {
      return next(new ErrorResponse('Ticket not found.', 404))
    }

    await Ticket.updateOne(
      { _id: foundTicket._id },
      {
        $pull: {
          messages: {
            _id: messageId,
          },
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Message deleted.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
