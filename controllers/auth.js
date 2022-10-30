const crypto = require('crypto')
const User = require('../models/User')
const Lab = require('../models/Lab')
const Notification = require('../models/Notification')
const Subscriber = require('../models/Subscriber')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')

exports.register = async (req, res, next) => {
  const { name, email, password, labId, matricNo } = req.body

  if (!name || !email || !password || !labId || !matricNo) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const duplicate = await User.findOne({ email })
  if (duplicate) {
    return next(new ErrorResponse('Email registered.', 409))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const user = await User.create(
      [
        {
          name,
          email,
          password,
          matricNo,
          roles: {
            lab: foundLab._id,
          },
        },
      ],
      { session }
    )

    await Lab.updateOne(
      foundLab,
      {
        $push: {
          labUsers: user[0]._id,
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    const emailVerificationToken = user[0].getEmailVerificationToken()

    await user[0].save()

    await User.updateOne(
      { _id: foundLab.labOwner },
      {
        $set: {
          notification: true,
        },
      },
      { new: true, session }
    )

    await Notification.create(
      [
        {
          lab: foundLab._id,
          users: [foundLab.labOwner],
          requestor: user[0]._id,
          type: 'Request Approval',
        },
      ],
      { session }
    )

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
        message: `[Lab ${foundLab.labName}] ${user[0].name} requested access to your lab.`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    }

    await session.commitTransaction()
    session.endSession()

    sendVerificationEmail(user[0], emailVerificationToken, res, next)
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    if (error.code === 11000 && error.keyPattern.hasOwnProperty('matricNo')) {
      return next(new ErrorResponse('Matric number existed.', 409))
    }

    next(error)
  }
}

exports.emailVerification = async (req, res, next) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.emailVerificationToken)
    .digest('hex')

  try {
    const user = await User.findOne({
      emailVerificationToken,
    })

    if (!user) {
      return next(new ErrorResponse('Invalid email verification token.', 400))
    }

    user.emailVerificationToken = undefined
    user.isEmailVerified = true
    user.lastUpdated = Date.now()

    await user.save()

    res.status(201).json({
      success: true,
      data: 'Account activated.',
      avatar: user.avatar,
    })
  } catch (error) {
    next(error)
  }
}

exports.sendEmailVerification = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return next(new ErrorResponse('User not found.', 404))
    }

    const emailVerificationToken = user.getEmailVerificationToken()

    await user.save()

    sendVerificationEmail(user, emailVerificationToken, res, next)
  } catch (error) {
    next(error)
  }
}

exports.changeEmail = async (req, res, next) => {
  const { email, newEmail } = req.body

  if (!email || !newEmail) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  const duplicate = await User.findOne({ email: newEmail })

  if (duplicate) {
    return next(new ErrorResponse('Email registered.', 409))
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return next(new ErrorResponse('User not found.', 404))
    }

    user.email = newEmail

    const emailVerificationToken = user.getEmailVerificationToken()

    await user.save()

    sendVerificationEmail(user, emailVerificationToken, res, next)
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  const { email, password, rememberMe } = req.body

  if (!email || !password) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  try {
    const user = await User.findOne({ email })
      .select('+password')
      .populate('roles.lab', 'labName status')

    if (!user) {
      return next(new ErrorResponse('Invalid credentials.', 401))
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials.', 401))
    }

    if (!user.isEmailVerified) {
      return next(new ErrorResponse('Email not verified.', 403))
    }

    sendToken(user, rememberMe, 200, res)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

exports.logout = async (req, res, next) => {
  // On client side, the accessToken also being deleted

  const { userId, allDevices } = req.body
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return next(new ErrorResponse('Refresh token not found.', 204))
  }

  if (allDevices) {
    const foundUser = await User.findById(userId)

    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 204))
    }

    foundUser.refreshToken = undefined
    await foundUser.save()
  }

  res
    .status(204)
    .cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 0,
    })
    .send()
}

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return next(new ErrorResponse('User not found.', 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save()

    const resetUrl = `${process.env.DOMAIN_NAME}/reset-password/${resetToken}`

    try {
      sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        template: 'reset_password',
        context: {
          url: resetUrl,
        },
      })

      res.status(200).json({ success: true, data: 'Email sent.' })
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      return next(new ErrorResponse('Email could not be sent.', 500))
    }
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next(new ErrorResponse('Invalid reset password token.', 400))
    }

    user.password = req.body.password
    user.refreshToken = undefined
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    user.lastUpdated = Date.now()

    await user.save()

    res.status(201).json({
      success: true,
      data: 'Password reset successful.',
    })
  } catch (error) {
    next(error)
  }
}

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.sendStatus(204)
  }

  try {
    const foundUser = await User.findOne({
      refreshToken: refreshToken,
    }).populate('roles.lab', 'labName status')

    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 403))
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    )

    if (foundUser.email !== decoded.email) {
      return next(new ErrorResponse('User not found.', 403))
    }

    const accessToken = foundUser.getAccessToken()

    const subscriber = await Subscriber.findOne(
      { user: foundUser._id },
      'endpoint'
    )

    const adminRoles = []

    if (foundUser.isAdmin) {
      const labs = await Lab.find({}, 'labName status')

      labs.forEach((lab) =>
        adminRoles.push({
          _id: lab._id,
          lab,
          role: ROLES_LIST.admin,
          status: 'Active',
        })
      )
    }

    res.status(200).json({
      success: true,
      email: foundUser.email,
      accessToken: accessToken,
      roles:
        foundUser.isAdmin && adminRoles.length !== 0
          ? adminRoles
          : foundUser.roles,
      isAdmin: foundUser.isAdmin,
      id: foundUser._id,
      name: foundUser.name,
      avatar: foundUser.avatar,
      notification: foundUser.notification,
      avatarPath: '/public/avatars/',
      SDSPath: '/public/SDSs/',
      subscriber,
      isUnsubscribed: foundUser.isUnsubscribed,
    })
  } catch (error) {
    return next(new ErrorResponse('Invalid refresh token.', 401))
  }
}

exports.labs = (req, res, next) => {
  try {
    Lab.find({ status: 'In Use' }, 'labName', (err, data) => {
      if (!err) {
        res.status(200).json({
          success: true,
          labs: data,
        })
      }
    })
  } catch (error) {
    return next(new ErrorResponse('Lab not found.', 404))
  }
}

exports.emails = (req, res, next) => {
  try {
    User.find({}, 'email', (err, data) => {
      if (!err) {
        res.status(200).json({
          success: true,
          emails: data,
        })
      }
    })
  } catch (error) {
    return next(new ErrorResponse('Email not found.', 404))
  }
}

exports.applyNewLab = async (req, res, next) => {
  const { email, labId } = req.body

  if (!email || !labId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundUser = await User.findOne({ email })
  if (!foundUser) {
    return next(new ErrorResponse('Email registered.', 409))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const isUserExisted =
    foundLab.labUsers.some((user) => user._id.equals(foundUser._id)) ||
    foundLab.labOwner.equals(foundUser._id)

  if (isUserExisted) {
    return next(new ErrorResponse('User existed.', 409))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await User.updateOne(
      foundUser,
      {
        $push: {
          roles: {
            lab: labId,
            role: ROLES_LIST.guest,
          },
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Lab.updateOne(
      foundLab,
      {
        $push: {
          labUsers: foundUser._id,
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await User.updateOne(
      { _id: foundLab.labOwner },
      {
        $set: {
          notification: true,
        },
      },
      { new: true, session }
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
        message: `[Lab ${foundLab.labName}] ${foundUser.name} requested access to your lab`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    }

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'New lab applied.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

const sendToken = async (user, rememberMe, statusCode, res) => {
  const accessToken = user.getAccessToken()
  const refreshToken = user.getRefreshToken()

  user.rememberMe = rememberMe
  user.refreshToken = refreshToken
  await user.save()

  const subscriber = await Subscriber.findOne({ user: user._id }, 'endpoint')

  const adminRoles = []

  if (user.isAdmin) {
    const labs = await Lab.find({}, 'labName status')

    labs.forEach((lab) =>
      adminRoles.push({
        _id: lab._id,
        lab,
        role: ROLES_LIST.admin,
        status: 'Active',
      })
    )
  }

  // 86400000ms = 1 day
  let expiryDate = new Date(
    Date.now() + Number(process.env.COOKIE_REFRESH_TOKEN_EXPIRE) * 86400000
  )
  expiryDate.setHours(0, 0, 0, 0)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    expires: user.rememberMe ? expiryDate : false,
  })

  res.status(statusCode).json({
    success: true,
    accessToken: accessToken,
    roles: user.isAdmin && adminRoles.length !== 0 ? adminRoles : user.roles,
    isAdmin: user.isAdmin,
    id: user._id,
    name: user.name,
    avatar: user.avatar,
    notification: user.notification,
    avatarPath: '/public/avatars/',
    SDSPath: '/public/SDSs/',
    subscriber,
    isUnsubscribed: user.isUnsubscribed,
  })
}

const sendVerificationEmail = async (
  user,
  emailVerificationToken,
  res,
  next
) => {
  const emailVerificationUrl = `${process.env.DOMAIN_NAME}/verify-email/${emailVerificationToken}`

  try {
    sendEmail({
      to: user.email,
      subject: 'Email Verification Request',
      template: 'email_verification',
      context: {
        url: emailVerificationUrl,
      },
    })

    res.status(201).json({
      success: true,
      data: 'The verification email has been sent.',
    })
  } catch (error) {
    return next(new ErrorResponse('Email could not be sent.', 500))
  }
}

module.exports.sendVerificationEmail = sendVerificationEmail
