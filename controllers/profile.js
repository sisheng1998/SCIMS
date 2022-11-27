const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Lab = require('../models/Lab')
const Subscriber = require('../models/Subscriber')
const Notification = require('../models/Notification')
const { sendVerificationEmail } = require('./auth')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')

const UserInfo =
  'name email altEmail avatar matricNo isEmailVerified createdAt lastUpdated roles.lab roles.role roles.status isAdmin'

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, UserInfo).populate(
      'roles.lab',
      'labName status'
    )

    if (!user) {
      return next(new ErrorResponse('User not found.', 404))
    }

    const subscriber = await Subscriber.findOne(
      { user: req.user._id },
      'endpoint'
    )

    let admin = {}

    if (user.isAdmin) {
      const adminRoles = []
      const labs = await Lab.find({}, 'labName status')

      labs.forEach((lab) =>
        adminRoles.push({
          _id: lab._id,
          lab,
          role: ROLES_LIST.admin,
          status: 'Active',
        })
      )

      admin = { ...user._doc, roles: adminRoles }
    }

    res.status(200).json({
      success: true,
      user: user.isAdmin && Object.keys(admin).length !== 0 ? admin : user,
      subscriber,
    })
  } catch (error) {
    return next(new ErrorResponse('User not found.', 404))
  }
}

exports.updateProfile = async (req, res, next) => {
  const userId = req.user._id
  const { matricNo, name, altEmail } = req.body

  if (!matricNo || !name || !altEmail) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  try {
    const foundUser = await User.findById(userId)
    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 404))
    }

    if (foundUser.matricNo !== matricNo) {
      foundUser.matricNo = matricNo
    }

    if (foundUser.name !== name) {
      foundUser.name = name
    }

    if (foundUser.altEmail !== altEmail) {
      foundUser.altEmail = altEmail
    }

    foundUser.lastUpdated = Date.now()

    await foundUser.save()

    res.status(201).json({
      success: true,
      data: 'Personal info updated.',
    })
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.hasOwnProperty('matricNo')) {
      return next(new ErrorResponse('Matric number existed.', 409))
    }

    next(error)
  }
}

exports.changeEmail = async (req, res, next) => {
  const userId = req.user._id
  const { email } = req.body

  if (!email) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  const duplicate = await User.findOne({ email })
  if (duplicate) {
    return next(new ErrorResponse('Email registered.', 409))
  }

  try {
    const foundUser = await User.findById(userId)
    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 404))
    }

    foundUser.email = email
    foundUser.isEmailVerified = false
    foundUser.refreshToken = undefined
    foundUser.lastUpdated = Date.now()

    const emailVerificationToken = foundUser.getEmailVerificationToken()

    await foundUser.save()

    sendVerificationEmail(foundUser, emailVerificationToken, res, next)
  } catch (error) {
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  const userId = req.user._id
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  try {
    const foundUser = await User.findById(userId).select('+password')
    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 404))
    }

    const isMatch = await foundUser.matchPassword(currentPassword)
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials.', 401))
    }

    foundUser.password = newPassword
    foundUser.refreshToken = undefined
    foundUser.lastUpdated = Date.now()

    await foundUser.save()

    res.status(201).json({
      success: true,
      data: 'Password changed.',
    })
  } catch (error) {
    next(error)
  }
}

exports.completeProfile = async (req, res, next) => {
  const userId = req.user._id

  const foundUser = await User.findById(userId)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const { matricNo, name, altEmail, labId } = JSON.parse(req.body.profileInfo)
  const avatar = req.file.filename

  if (!matricNo || !name || !altEmail || !avatar) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await User.updateOne(
      { _id: foundUser._id },
      {
        $unset: {
          isProfileNotCompleted: '',
        },
        $set: {
          matricNo,
          name,
          altEmail,
          avatar,
          lastUpdated: Date.now(),
        },
      },
      { session }
    )

    if (labId) {
      const foundLab = await Lab.findById(labId)
      if (!foundLab) {
        return next(new ErrorResponse('Lab not found.', 404))
      }

      await User.updateOne(
        { _id: foundUser._id },
        {
          $push: {
            roles: {
              lab: foundLab._id,
            },
          },
        },
        { session }
      )

      await Lab.updateOne(
        { _id: foundLab._id },
        {
          $push: {
            labUsers: foundUser._id,
          },
          $set: {
            lastUpdated: Date.now(),
          },
        },
        { session }
      )

      await User.updateOne(
        { _id: foundLab.labOwner },
        {
          $set: {
            notification: true,
          },
        },
        { session }
      )

      await Notification.create(
        [
          {
            lab: foundLab._id,
            users: [foundLab.labOwner],
            requestor: foundUser._id,
            type: 'Request Approval',
          },
        ],
        { session }
      )

      const labOwner = await User.findOne({ _id: foundLab.labOwner }, 'email')

      sendEmail({
        to: labOwner.email,
        subject: 'New User Request',
        template: 'new_user_request',
        context: {
          lab: foundLab.labName,
          matricNo,
          name,
          email: foundUser.email,
        },
      })

      const subscribedUser = await Subscriber.findOne(
        { user: foundLab.labOwner },
        'endpoint keys'
      )

      if (subscribedUser) {
        const subscription = {
          endpoint: subscribedUser.endpoint,
          keys: subscribedUser.keys,
        }

        const payload = JSON.stringify({
          title: 'New User Request',
          message: `[Lab ${foundLab.labName}] ${name} requested access to your lab.`,
          url: '/notifications',
        })

        sendNotification(subscription, payload)
      }
    }

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Profile completed.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    if (error.code === 11000 && error.keyPattern.hasOwnProperty('matricNo')) {
      return next(new ErrorResponse('Matric number existed.', 409))
    }

    next(error)
  }
}

exports.updateAvatar = async (req, res, next) => {
  const userId = req.user._id

  try {
    const foundUser = await User.findById(userId)
    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 404))
    }

    await User.updateOne(
      { _id: foundUser._id },
      {
        $set: {
          avatar: req.file.filename,
          lastUpdated: Date.now(),
        },
      }
    )

    res.status(201).json({
      success: true,
      data: 'User avatar updated',
    })
  } catch (error) {
    next(error)
  }
}
