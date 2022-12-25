const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Ticket = require('../models/Ticket')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const { startSession } = require('mongoose')

const PIC_EMAIL = 'sisheng1998@gmail.com'

exports.openTicket = async (req, res, next) => {
  const { labId, role, subject, message } = JSON.parse(req.body.ticketInfo)

  if (!labId || !subject || !message) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundUser = await User.findById(req.user._id)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  if (labId !== 'All Labs' && labId !== '9999') {
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
          user: foundUser._id,
          lab: labId,
          role,
          subject,
          message,
          attachments: req.files.map((file) => file.filename),
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

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

    res.status(201).json({
      success: true,
      data: 'New ticket opened.',
      ticketId: newTicket[0]._id,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
