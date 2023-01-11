const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const User = require('../models/User')
const Chemical = require('../models/Chemical')
const Notification = require('../models/Notification')
const Subscriber = require('../models/Subscriber')
const Config = require('../models/Config')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')
const fs = require('fs')
const path = require('path')
const { backupDatabaseSync, restoreDatabaseSync } = require('../utils/backup')

const UserInfo =
  'name email altEmail avatar matricNo isEmailVerified createdAt lastUpdated roles.lab roles.role roles.status isAdmin isProfileNotCompleted'

// Dashboard
exports.getInfo = async (req, res, next) => {
  try {
    const today = new Date()
    const past = new Date(today.setDate(today.getDate() - 30))

    const data = {}

    data.totalUsers = await User.countDocuments({})
    data.newUsers = await User.countDocuments({
      createdAt: { $gte: past },
    })

    data.totalLabs = await Lab.countDocuments({})
    data.newLabs = await Lab.countDocuments({
      createdAt: { $gte: past },
    })

    data.totalChemicals = await Chemical.countDocuments({})
    data.newChemicals = await Chemical.countDocuments({
      createdAt: { $gte: past },
    })
    data.lowAmountChemicals = await Chemical.countDocuments({
      status: 'Low Amount',
    })
    data.expiringChemicals = await Chemical.countDocuments({
      status: 'Expiring Soon',
    })
    data.expiredChemicals = await Chemical.countDocuments({
      status: 'Expired',
    })
    data.disposedChemicals = await Chemical.countDocuments({
      status: 'Disposed',
    })

    data.chemicals = await Chemical.find({}, 'name expirationDate')

    const config = await Config.findOne({}, '-_id')
    data.dayBeforeExp = config.DAY_BEFORE_EXP

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

// Labs
exports.getLabs = async (req, res, next) => {
  try {
    const labs = await Lab.find({})
      .populate('labOwner', 'name email avatar isAdmin')
      .populate({
        path: 'labUsers',
        match: {
          $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
        },
        select: 'name email avatar isAdmin',
      })
    const users = await User.find({}, 'name email avatar')
    const admins = await User.countDocuments({
      isAdmin: true,
    })

    res.status(200).json({
      success: true,
      labs,
      users,
      admins,
    })
  } catch (error) {
    next(error)
  }
}

exports.addLab = async (req, res, next) => {
  const { email, password, labName } = req.body

  if (!email || !password || !labName) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const duplicate = await User.findOne({ email })
  if (duplicate) {
    return next(new ErrorResponse('Email registered.', 409))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const lab = await Lab.create(
      [
        {
          labName,
        },
      ],
      { session }
    )

    const user = await User.create(
      [
        {
          email,
          password,
          roles: {
            lab: lab[0]._id,
            role: ROLES_LIST.labOwner,
            status: 'Active',
          },
          notification: true,
          isProfileNotCompleted: true,
        },
      ],
      { session }
    )

    await Lab.updateOne(
      { _id: lab[0]._id },
      {
        $set: {
          labOwner: user[0]._id,
        },
      },
      { new: true, session }
    )

    await Notification.create(
      [
        {
          lab: lab[0]._id,
          users: [user[0]._id],
          type: 'New Lab Created',
        },
      ],
      { session }
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
      data: 'New user and lab created.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    if (error.code === 11000) {
      if (error.keyPattern.hasOwnProperty('labName')) {
        return next(new ErrorResponse('Lab name existed.', 409))
      }
    }

    next(error)
  }
}

exports.addLabWithExistingUser = async (req, res, next) => {
  const { ownerId, labName } = req.body

  if (!ownerId || !labName) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  const foundUser = await User.findById(ownerId)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const lab = await Lab.create(
      [
        {
          labName,
          labOwner: foundUser._id,
        },
      ],
      { session }
    )

    await User.updateOne(
      { _id: foundUser._id },
      {
        $push: {
          roles: {
            lab: lab[0]._id,
            role: ROLES_LIST.labOwner,
            status: 'Active',
          },
        },
        $set: {
          notification: true,
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Notification.create(
      [
        {
          lab: lab[0]._id,
          users: [foundUser._id],
          type: 'New Lab Created',
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
        title: 'New Lab Created',
        message: `[Lab ${lab[0].labName}] A new lab have been created for you.`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    }

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'New lab created.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    if (error.code === 11000) {
      return next(new ErrorResponse('Lab name existed.', 409))
    }

    next(error)
  }
}

exports.updateLab = async (req, res, next) => {
  const { labId, ownerId, labName, status } = req.body

  if (!labId || !ownerId || !labName || !status) {
    return next(new ErrorResponse('Missing value.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    if (!foundLab.labOwner.equals(ownerId)) {
      const previousOwnerId = foundLab.labOwner

      // Change labOwner to new lab owner id
      foundLab.labOwner = ownerId

      // Remove the role from the old lab owner's roles
      await User.updateOne(
        { _id: previousOwnerId },
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

      await Notification.create(
        [
          {
            lab: foundLab._id,
            users: [previousOwnerId],
            type: 'Removed From Lab',
          },
        ],
        { session }
      )

      const subscribedPreviousOwner = await Subscriber.findOne(
        { user: previousOwnerId },
        'endpoint keys'
      )

      if (subscribedPreviousOwner) {
        const subscription = {
          endpoint: subscribedPreviousOwner.endpoint,
          keys: subscribedPreviousOwner.keys,
        }

        const payload = JSON.stringify({
          title: 'Lost Access To The Lab',
          message: `[Lab ${foundLab.labName}] You have been removed from the lab.`,
          url: '/notifications',
        })

        sendNotification(subscription, payload)
      }

      const foundUser = await User.findById(ownerId)
      if (!foundUser) {
        return next(new ErrorResponse('User not found.', 404))
      }

      // Check whether the new owner already exist in the lab users list
      if (foundLab.labUsers.some((user) => user.equals(ownerId))) {
        // Update the role and status of new lab owner (role existed)
        await User.updateOne(
          { _id: foundUser._id },
          {
            $set: {
              'roles.$[el].role': ROLES_LIST.labOwner,
              'roles.$[el].status': 'Active',
              notification: true,
              lastUpdated: Date.now(),
            },
          },
          { arrayFilters: [{ 'el.lab': labId }], new: true, session }
        )

        await Notification.create(
          [
            {
              lab: foundLab._id,
              users: [foundUser._id],
              type: 'Lab Owner Role',
            },
          ],
          { session }
        )

        const subscribedNewOwner = await Subscriber.findOne(
          { user: foundUser._id },
          'endpoint keys'
        )

        if (subscribedNewOwner) {
          const subscription = {
            endpoint: subscribedNewOwner.endpoint,
            keys: subscribedNewOwner.keys,
          }

          const payload = JSON.stringify({
            title: 'User Role Changed',
            message: `[Lab ${foundLab.labName}] You are now the Lab Owner of the lab.`,
            url: '/notifications',
          })

          sendNotification(subscription, payload)
        }

        // Remove the new lab owner in the lab users list
        foundLab.labUsers = foundLab.labUsers.filter(
          (userId) => !userId.equals(ownerId)
        )
      } else {
        // Push new role to new lab owner's roles (role not exist)
        await User.updateOne(
          { _id: foundUser._id },
          {
            $push: {
              roles: {
                lab: foundLab._id,
                role: ROLES_LIST.labOwner,
                status: 'Active',
              },
            },
            $set: {
              notification: true,
              lastUpdated: Date.now(),
            },
          },
          { new: true, session }
        )

        await Notification.create(
          [
            {
              lab: foundLab._id,
              users: [foundUser._id],
              type: 'Lab Owner Role',
            },
          ],
          { session }
        )

        const subscribedNewOwner = await Subscriber.findOne(
          { user: foundUser._id },
          'endpoint keys'
        )

        if (subscribedNewOwner) {
          const subscription = {
            endpoint: subscribedNewOwner.endpoint,
            keys: subscribedNewOwner.keys,
          }

          const payload = JSON.stringify({
            title: 'User Role Changed',
            message: `[Lab ${foundLab.labName}] You are now the Lab Owner of the lab.`,
            url: '/notifications',
          })

          sendNotification(subscription, payload)
        }
      }
    }

    if (foundLab.labName !== labName) {
      foundLab.labName = labName
    }

    if (foundLab.status !== status) {
      foundLab.status = status
    }

    foundLab.lastUpdated = Date.now()

    await foundLab.save()

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Lab information updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    if (error.code === 11000) {
      return next(new ErrorResponse('Lab name existed.', 409))
    }

    next(error)
  }
}

exports.removeLab = async (req, res, next) => {
  const { labId } = req.body

  if (!labId) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const userIds = foundLab.labUsers
    userIds.push(foundLab.labOwner)

    await User.updateMany(
      { _id: { $in: userIds.map((user) => user._id) } },
      {
        $pull: {
          roles: {
            lab: labId,
          },
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Lab.deleteOne({ _id: labId }, { session })

    await Notification.deleteMany({ lab: labId }, { session })

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Lab removed.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

// Users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, UserInfo).populate(
      'roles.lab',
      'labName status'
    )
    const labs = await Lab.find({}, 'labName status')

    res.status(200).json({
      success: true,
      users,
      labs,
    })
  } catch (error) {
    next(error)
  }
}

// Backup / Restore
exports.getBackups = async (req, res, next) => {
  try {
    const autoBackups = []
    const manualBackups = []

    const autoBackupPath = path.resolve(__dirname, '../public/backups/auto/')

    fs.readdirSync(autoBackupPath).forEach((file) => {
      if (path.extname(file) !== '.gzip') return

      const stats = fs.statSync(`${autoBackupPath}/${file}`)

      const backup = {
        name: file,
        size: stats.size,
        date: stats.birthtime,
        type: 'Auto',
      }

      autoBackups.push(backup)
    })

    const manualBackupPath = path.resolve(
      __dirname,
      '../public/backups/manual/'
    )

    fs.readdirSync(manualBackupPath).forEach((file) => {
      if (path.extname(file) !== '.gzip') return

      const stats = fs.statSync(`${manualBackupPath}/${file}`)

      const backup = {
        name: file,
        size: stats.size,
        date: stats.birthtime,
        type: 'Manual',
      }

      manualBackups.push(backup)
    })

    const backups = [...autoBackups, ...manualBackups]
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      .map((backup, index) => ({
        index,
        ...backup,
      }))

    res.status(200).json({
      success: true,
      backups,
    })
  } catch (error) {
    next(error)
  }
}

exports.createBackup = async (req, res, next) => {
  try {
    const backup = await backupDatabaseSync('manual')

    if (backup !== undefined && backup !== 'error') {
      res.status(201).json({
        success: true,
        backup,
      })
    } else {
      return next(new ErrorResponse('Manual backup failed', 400))
    }
  } catch (error) {
    next(error)
  }
}

exports.deleteBackup = async (req, res, next) => {
  const { backup } = req.body

  if (
    !backup.hasOwnProperty('name') ||
    !backup.hasOwnProperty('type') ||
    !backup.name ||
    !backup.type
  ) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  try {
    const backupPath = path.resolve(
      __dirname,
      `../public/backups/${backup.type.toLowerCase()}/${backup.name}`
    )

    if (!fs.existsSync(backupPath)) {
      return next(new ErrorResponse('Backup not found.', 404))
    }

    fs.unlinkSync(backupPath, (error) => {
      if (error)
        return next(new ErrorResponse('Not able to delete backup.', 400))
    })

    res.status(200).json({
      success: true,
      data: 'Backup deleted.',
    })
  } catch (error) {
    next(error)
  }
}

exports.restoreBackup = async (req, res, next) => {
  const { backup } = req.body

  if (
    !backup.hasOwnProperty('name') ||
    !backup.hasOwnProperty('type') ||
    !backup.name ||
    !backup.type
  ) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  try {
    const backupPath = path.resolve(
      __dirname,
      `../public/backups/${backup.type.toLowerCase()}/${backup.name}`
    )

    if (!fs.existsSync(backupPath)) {
      return next(new ErrorResponse('Backup not found.', 404))
    }

    const result = await restoreDatabaseSync(
      backup.type.toLowerCase(),
      backup.name
    )

    if (result !== undefined && result !== 'error') {
      res.status(200).json({
        success: true,
        data: 'Restore completed.',
      })
    } else {
      return next(new ErrorResponse('Restoration failed', 400))
    }
  } catch (error) {
    next(error)
  }
}

// Settings
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Config.findOne({}, '-_id')

    res.status(200).json({
      success: true,
      settings,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateSettings = async (req, res, next) => {
  const settings = req.body

  try {
    await Config.create([settings])

    res.status(200).json({
      success: true,
      data: 'Settings updated.',
    })
  } catch (error) {
    next(error)
  }
}

exports.sendTestEmail = async (req, res, next) => {
  const { emailConfig, testEmail } = req.body

  if (!testEmail) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  try {
    sendEmail({
      ...emailConfig,
      to: testEmail,
      subject: 'Test Email',
      template: 'test_email',
      context: {
        url: process.env.DOMAIN_NAME,
      },
    })

    res.status(200).json({
      success: true,
      data: 'Test email sent.',
    })
  } catch (error) {
    next(error)
  }
}
