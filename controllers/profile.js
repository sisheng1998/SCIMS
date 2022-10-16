const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const { sendVerificationEmail } = require('./auth')
const Subscriber = require('../models/Subscriber')

const UserInfo =
  'name email altEmail avatar matricNo isEmailVerified createdAt lastUpdated roles.lab roles.role roles.status'

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

    res.status(200).json({
      success: true,
      user,
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

exports.updateAvatar = async (req, res, next) => {
  const userId = req.user._id

  try {
    const foundUser = await User.findById(userId)
    if (!foundUser) {
      return next(new ErrorResponse('User not found.', 404))
    }

    await User.updateOne(foundUser, {
      $set: {
        avatar: req.file.filename,
        lastUpdated: Date.now(),
      },
    })

    res.status(201).json({
      success: true,
      data: 'User avatar updated',
    })
  } catch (error) {
    next(error)
  }
}
