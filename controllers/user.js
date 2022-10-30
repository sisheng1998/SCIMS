const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const Notification = require('../models/Notification')
const Subscriber = require('../models/Subscriber')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')

const UserInfo =
  'name email altEmail avatar matricNo isEmailVerified createdAt lastUpdated roles.lab roles.role roles.status isAdmin'

exports.getUsers = async (req, res, next) => {
  const { labId } = req.body

  try {
    if (labId === 'All Labs') {
      const labs = req.user.roles
        .filter((role) => role.status === 'Active')
        .map((role) => role.lab)

      const foundLabs = req.user.isAdmin
        ? await Lab.find(
            {
              status: 'In Use',
            },
            'labName'
          )
        : await Lab.find(
            {
              _id: {
                $in: labs,
              },
              status: 'In Use',
            },
            'labName'
          )

      if (foundLabs.length === 0) {
        return next(new ErrorResponse('Lab not found.', 404))
      }

      const users = await User.find(
        {
          roles: {
            $elemMatch: {
              lab: {
                $in: foundLabs,
              },
            },
          },
          $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
        },
        UserInfo
      )
        .populate('roles.lab', 'labName status')
        .sort({ createdAt: -1 })

      const admins = await User.find(
        {
          isAdmin: true,
        },
        UserInfo
      )
        .populate('roles.lab', 'labName status')
        .sort({ createdAt: -1 })

      res.status(200).json({
        success: true,
        data: {
          labs: foundLabs,
          users,
          admins,
        },
      })
    } else {
      const foundLab = await Lab.findById(labId)
        .populate({
          path: 'labOwner',
          match: {
            $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
          },
          select: UserInfo,
        })
        .populate({
          path: 'labUsers',
          match: {
            $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
          },
          select: UserInfo,
        })

      if (!foundLab) {
        return next(new ErrorResponse('Lab not found.', 404))
      }

      const admins = await User.find(
        {
          isAdmin: true,
        },
        UserInfo
      )

      // Get all existing users that are not in the current lab - for lab owner or admin to add existing user to their lab
      if (res.locals.user.role >= ROLES_LIST.labOwner) {
        const otherUsers = await User.find(
          {
            isEmailVerified: true,
            'roles.lab': { $ne: labId },
            $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
          },
          'name email'
        )

        res.status(200).json({
          success: true,
          data: foundLab,
          admins,
          otherUsers,
        })
      } else {
        res.status(200).json({
          success: true,
          data: foundLab,
          admins,
        })
      }
    }
  } catch (error) {
    return next(new ErrorResponse('Lab not found.', 404))
  }
}

exports.addUser = async (req, res, next) => {
  const { name, email, matricNo, password, labId, role } = req.body

  if (!name || !email || !matricNo || !password || !labId || !role) {
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
          matricNo,
          password,
          roles: {
            lab: foundLab._id,
            role,
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

    const emailVerificationUrl = `${process.env.DOMAIN_NAME}/verify-email/${emailVerificationToken}`

    sendEmail({
      to: user[0].email,
      subject: 'Email Verification Request',
      template: 'email_verification',
      context: {
        url: emailVerificationUrl,
      },
    })

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'New user created.',
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

exports.userApproval = async (req, res, next) => {
  const { userId, labId, role, message, approve } = req.body

  if (!userId || !labId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundUser = await User.findById(userId)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    if (approve) {
      await User.updateOne(
        foundUser,
        {
          $set: {
            'roles.$[el].role': role,
            'roles.$[el].status': 'Active',
            notification: true,
            lastUpdated: Date.now(),
          },
        },
        { arrayFilters: [{ 'el.lab': foundLab._id }], new: true, session }
      )
    } else {
      await User.updateOne(
        foundUser,
        {
          $pull: {
            roles: {
              lab: foundLab._id,
            },
          },
          $set: {
            notification: true,
            lastUpdated: Date.now(),
          },
        },
        { new: true, session }
      )

      await Lab.updateOne(
        foundLab,
        {
          $pull: {
            labUsers: foundUser._id,
          },
          $set: {
            lastUpdated: Date.now(),
          },
        },
        { new: true, session }
      )
    }

    await Notification.create(
      [
        {
          lab: foundLab._id,
          users: [foundUser._id],
          type: approve ? 'Request Approved' : 'Request Declined',
        },
      ],
      { session }
    )

    let roleName = 'Guest'
    if (role === 5555) roleName = 'Postgraduate'
    else if (role === 3333) roleName = 'Undergraduate'

    sendEmail({
      to: foundUser.email,
      subject: 'Lab Application Result',
      template: 'lab_application_result',
      context: {
        lab: foundLab.labName,
        role: roleName,
        approve: approve,
        message: message,
      },
    })

    const subscribedUser = await Subscriber.findOne(
      { user: foundUser._id },
      'endpoint keys'
    )

    if (subscribedUser) {
      const subscription = {
        endpoint: subscribedUser.endpoint,
        keys: subscribedUser.keys,
      }

      const payload = JSON.stringify({
        title: 'Lab Application Result',
        message: `[Lab ${foundLab.labName}] Your request have been ${
          approve ? 'approved' : 'declined'
        }.`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    }

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'User approval success.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.addExistingUser = async (req, res, next) => {
  const { userId, labId, role } = req.body

  if (!userId || !labId || !role) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundUser = await User.findById(userId)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  try {
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

    await User.updateOne(foundUser, {
      $push: {
        roles: {
          lab: foundLab._id,
          role,
        },
      },
      $set: {
        lastUpdated: Date.now(),
      },
    })

    await Lab.updateOne(foundLab, {
      $push: {
        labUsers: userId,
      },
      $set: {
        lastUpdated: Date.now(),
      },
    })

    res.status(200).json({
      success: true,
      data: 'User added.',
    })
  } catch (error) {
    next(error)
  }
}

exports.updateUser = async (req, res, next) => {
  const { userId, labId, status, role } = req.body

  if (!userId || !labId || !status || !role) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const foundUser = await User.findById(userId)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await User.updateOne(
      foundUser,
      {
        $set: {
          'roles.$[el].role': role,
          'roles.$[el].status': status,
          notification: true,
          lastUpdated: Date.now(),
        },
      },
      { arrayFilters: [{ 'el.lab': foundLab._id }], new: true, session }
    )

    const previousRole = foundUser.roles.find((role) =>
      role.lab.equals(foundLab._id)
    )

    let type
    let title
    let message

    if (previousRole.status !== status) {
      type = `User Role ${status}`
      title = 'Status Changed'
      message =
        status === 'Active'
          ? 'You are now able to access the lab.'
          : 'You are temporarily unable to access the lab.'
    } else {
      title = 'User Role Changed'

      if (role === ROLES_LIST.guest) {
        type = 'Guest Role'
        message = 'Your role have been changed to Guest.'
      } else if (role === ROLES_LIST.undergraduate) {
        type = 'Undergraduate Role'
        message = 'Your role have been changed to Undergraduate.'
      } else {
        type = 'Postgraduate Role'
        message = 'Your role have been changed to Postgraduate.'
      }
    }

    await Notification.create(
      [
        {
          lab: foundLab._id,
          users: [foundUser._id],
          type,
        },
      ],
      { session }
    )

    const subscribedUser = await Subscriber.findOne(
      { user: foundUser._id },
      'endpoint keys'
    )

    if (subscribedUser) {
      const subscription = {
        endpoint: subscribedUser.endpoint,
        keys: subscribedUser.keys,
      }

      const payload = JSON.stringify({
        title,
        message: `[Lab ${foundLab.labName}] ${message}`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    }

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'User information updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.removeUser = async (req, res, next) => {
  const { userId, labId } = req.body

  if (!userId || !labId) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const foundUser = await User.findById(userId)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await User.updateOne(
      foundUser,
      {
        $pull: {
          roles: {
            lab: foundLab._id,
          },
        },
        $set: {
          notification: true,
          lastUpdated: Date.now(),
        },
      },
      { session }
    )

    await Lab.updateOne(
      foundLab,
      {
        $pull: {
          labUsers: userId,
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { session }
    )

    await Notification.create(
      [
        {
          lab: foundLab._id,
          users: [foundUser._id],
          type: 'Removed From Lab',
        },
      ],
      { session }
    )

    const subscribedUser = await Subscriber.findOne(
      { user: foundUser._id },
      'endpoint keys'
    )

    if (subscribedUser) {
      const subscription = {
        endpoint: subscribedUser.endpoint,
        keys: subscribedUser.keys,
      }

      const payload = JSON.stringify({
        title: 'Lost Access To The Lab',
        message: `[Lab ${foundLab.labName}] You have been removed from the lab.`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    }

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'User removed.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
