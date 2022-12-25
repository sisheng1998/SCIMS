const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Ticket = require('../models/Ticket')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const { startSession } = require('mongoose')

const PIC_EMAIL = 'sisheng1998@gmail.com'

exports.getTickets = async (req, res, next) => {
  const user = req.user
  console.log(user)

  try {
    // const admins = await User.countDocuments({
    //   isAdmin: true,
    // })

    // if (labId === 'All Labs') {
    //   const labs = req.user.roles
    //     .filter((role) => role.status === 'Active')
    //     .map((role) => role.lab)

    //   const foundLabs = req.user.isAdmin
    //     ? await Lab.find(
    //         {
    //           status: 'In Use',
    //         },
    //         'labName locations'
    //       )
    //     : await Lab.find(
    //         {
    //           _id: {
    //             $in: labs.map((lab) => lab._id),
    //           },
    //           status: 'In Use',
    //         },
    //         'labName locations'
    //       )

    //   if (foundLabs.length === 0) {
    //     return next(new ErrorResponse('Lab not found.', 404))
    //   }

    //   const chemicals = await Chemical.find(
    //     {
    //       lab: {
    //         $in: foundLabs.map((lab) => lab._id),
    //       },
    //       status: {
    //         $ne: 'Disposed',
    //       },
    //     },
    //     'CASId QRCode amount minAmount containerSize expirationDate locationId lab name status unit lastUpdated'
    //   )
    //     .populate('CASId', '-_id')
    //     .populate('lab', 'labName')
    //     .sort({ createdAt: -1 })

    //   const disposedChemicals = await Chemical.find(
    //     {
    //       lab: {
    //         $in: foundLabs.map((lab) => lab._id),
    //       },
    //       status: 'Disposed',
    //     },
    //     'CASId QRCode amount minAmount expirationDate disposedDate locationId lab name status unit'
    //   )
    //     .populate('CASId', '-_id')
    //     .populate('lab', 'labName')
    //     .sort({ disposedDate: -1 })

    //   data = {
    //     labs: foundLabs,
    //     chemicals,
    //     disposedChemicals,
    //     admins,
    //   }
    // } else {
    //   const foundLab = await Lab.findById(labId, labOption)
    //     .populate({
    //       path: 'chemicals disposedChemicals',
    //       select: chemicalOption,
    //       populate: [
    //         {
    //           path: 'CASId',
    //           model: 'CAS',
    //         },
    //         {
    //           path: 'lab',
    //           select: 'labName _id',
    //         },
    //       ],
    //     })
    //     .populate({
    //       path: 'labOwner',
    //       match: {
    //         $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
    //       },
    //       select: UserInfo,
    //     })
    //     .populate({
    //       path: 'labUsers',
    //       match: {
    //         $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
    //       },
    //       select: UserInfo,
    //     })

    //   if (!foundLab) {
    //     return next(new ErrorResponse('Lab not found.', 404))
    //   }

    //   data = { ...foundLab._doc, admins }
    // }

    res.status(200).json({
      success: true,
      // data,
    })
  } catch (error) {
    return next(new ErrorResponse('Lab not found.', 404))
  }
}

exports.openTicket = async (req, res, next) => {
  const { labId, role, subject, message } = JSON.parse(req.body.ticketInfo)

  if (!labId || !subject || !message) {
    return next(new ErrorResponse('Missing value for required field.', 400))
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
          user: req.user._id,
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
