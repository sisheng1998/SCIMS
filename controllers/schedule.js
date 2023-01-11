const schedule = require('node-schedule')
const Chemical = require('../models/Chemical')
const User = require('../models/User')
const Lab = require('../models/Lab')
const Subscriber = require('../models/Subscriber')
const Notification = require('../models/Notification')
const Usage = require('../models/Usage')
const Config = require('../models/Config')
const ROLES_LIST = require('../config/roles_list')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')
const logEvents = require('../middleware/logEvents')
const { backupDatabase, deleteOldAutoBackups } = require('../utils/backup')

const notifyUsers = (chemicals, type) => {
  chemicals.forEach(async (chemical) => {
    if (chemical.lab === null) return

    const users = await User.find(
      {
        roles: {
          $elemMatch: {
            lab: { $eq: chemical.lab._id },
            role: { $gte: ROLES_LIST.postgraduate },
            status: { $eq: 'Active' },
          },
        },
      },
      'email'
    )

    users.forEach(async (user) => {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            notification: true,
          },
        }
      )

      const emailOptions = {
        to: user.email,
        subject:
          type === 'Expired'
            ? 'Alert - Chemical Expired'
            : 'Alert - Chemical Expiring Soon',
        template: type === 'Expired' ? 'expired' : 'expiring_soon',
        context: {
          lab: chemical.lab.labName,
          chemicalName: chemical.name,
          url: `${process.env.DOMAIN_NAME}/inventory/${chemical._id}`,
        },
      }

      sendEmail(emailOptions)
    })

    await Notification.create({
      lab: chemical.lab._id,
      users: users.map((user) => user._id),
      chemical: chemical._id,
      type,
    })

    const subscribers = await Subscriber.find(
      { user: { $in: users.map((user) => user._id) } },
      'endpoint keys'
    )

    subscribers.forEach((subscriber) => {
      const subscription = {
        endpoint: subscriber.endpoint,
        keys: subscriber.keys,
      }

      const payload = JSON.stringify({
        title:
          type === 'Expired'
            ? 'Alert - Chemical Expired'
            : 'Alert - Chemical Expiring Soon',
        message:
          type === 'Expired'
            ? `[Lab ${chemical.lab.labName}] ${chemical.name} expired.`
            : `[Lab ${chemical.lab.labName}] ${chemical.name} is expiring soon.`,
        url: '/notifications',
      })

      sendNotification(subscription, payload)
    })
  })
}

module.exports = async () => {
  // At 00:15 (UTC) / 08:15 (MYT) Everyday - Update all chemical status
  schedule.scheduleJob('Daily Status Update', '15 8 * * *', async () => {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const config = await Config.findOne({}, '-_id')

    const future = new Date(
      new Date().setDate(today.getDate() + config.DAY_BEFORE_EXP)
    )

    try {
      // Handle expired chemicals
      const expiredChemicals = await Chemical.find(
        {
          status: {
            $nin: ['Disposed', 'Expired'],
          },
          expirationDate: {
            $lt: today,
          },
        },
        'name lab'
      ).populate({
        path: 'lab',
        select: 'labName status',
        match: { status: { $eq: 'In Use' } },
      })

      await Chemical.updateMany(
        {
          status: {
            $nin: ['Disposed', 'Expired'],
          },
          expirationDate: {
            $lt: today,
          },
        },
        {
          $set: {
            status: 'Expired',
            lastUpdated: today,
          },
        }
      )

      notifyUsers(expiredChemicals, 'Expired')

      // Handle expiring chemicals
      const expiringChemicals = await Chemical.find(
        {
          status: {
            $nin: ['Expiring Soon', 'Disposed', 'Expired'],
          },
          expirationDate: {
            $lt: future,
          },
        },
        'name lab'
      ).populate({
        path: 'lab',
        select: 'labName status',
        match: { status: { $eq: 'In Use' } },
      })

      await Chemical.updateMany(
        {
          status: {
            $nin: ['Expiring Soon', 'Disposed', 'Expired'],
          },
          expirationDate: {
            $lt: future,
          },
        },
        {
          $set: {
            status: 'Expiring Soon',
            lastUpdated: today,
          },
        }
      )

      notifyUsers(expiringChemicals, 'Expiring Soon')
    } catch (error) {
      logEvents(`${error.name}: ${error.message}`, 'scheduleErrorLogs.txt')
    }
  })

  // At 00:30 (UTC) / 08:30 (MYT) on Monday - Send weekly report to lab owner
  schedule.scheduleJob('Weekly Report', '30 8 * * 1', async () => {
    const today = new Date()
    const past = new Date(new Date().setDate(today.getDate() - 7))

    const todayDate = today.toLocaleDateString('en-GB')
    const pastDate = past.toLocaleDateString('en-GB')

    const options = {
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h12',
    }

    try {
      const labs = await Lab.find(
        {
          status: 'In Use',
        },
        'labName labOwner chemicals disposedChemicals'
      )
        .populate('labOwner', 'email')
        .populate({
          path: 'chemicals disposedChemicals',
          select: 'CASId name amount minAmount status createdAt lastUpdated',
          match: {
            lastUpdated: {
              $gte: past,
              $lt: today,
            },
          },
          populate: {
            path: 'CASId',
            select: 'CASNo',
          },
        })
        .lean()

      labs.forEach(async (lab) => {
        const records = await Usage.find(
          { lab: lab._id, date: { $gte: past, $lt: today } },
          'chemical usage unit date -_id'
        )
          .populate({
            path: 'chemical',
            select: 'CASId name -_id',
            populate: {
              path: 'CASId',
              model: 'CAS',
              select: 'CASNo -_id',
            },
          })
          .sort({ date: -1 })
          .lean()

        const usageRecords = records.map((record) => ({
          ...record,
          usage: parseFloat(Number(record.usage).toFixed(2)),
          date: new Date(record.date)
            .toLocaleString('en-GB', options)
            .toUpperCase(),
        }))

        const newChemicals = lab.chemicals.filter(
          (chemical) => chemical.createdAt >= past && chemical.createdAt < today
        )

        const lowAmountChemicals = lab.chemicals.filter(
          (chemical) =>
            chemical.status !== 'Expired' &&
            chemical.amount <= chemical.minAmount
        )

        const expiringChemicals = lab.chemicals.filter(
          (chemical) => chemical.status === 'Expiring Soon'
        )

        const expiredChemicals = lab.chemicals.filter(
          (chemical) => chemical.status === 'Expired'
        )

        const disposedChemicals = lab.disposedChemicals

        if (
          usageRecords.length !== 0 ||
          newChemicals.length !== 0 ||
          lowAmountChemicals.length !== 0 ||
          expiringChemicals.length !== 0 ||
          expiredChemicals.length !== 0 ||
          disposedChemicals.length !== 0
        ) {
          const emailOptions = {
            to: lab.labOwner.email,
            subject: `SCIMS Weekly Report (${todayDate})`,
            template: 'weekly_report',
            context: {
              todayDate,
              pastDate,
              lab: lab.labName,
              usageRecords,
              newChemicals,
              lowAmountChemicals,
              expiringChemicals,
              expiredChemicals,
              disposedChemicals,
            },
          }

          sendEmail(emailOptions)
        }
      })
    } catch (error) {
      logEvents(`${error.name}: ${error.message}`, 'scheduleErrorLogs.txt')
    }
  })

  // At 16:00 (UTC) / 00:00 (MYT) Everyday - Backup database & delete old backups
  schedule.scheduleJob('Daily Backup', '0 0 * * *', async () => {
    try {
      const config = await Config.findOne({}, '-_id')
      const maxDays = config.MAX_DAYS_FOR_BACKUP

      backupDatabase()
      deleteOldAutoBackups(maxDays)
    } catch (error) {
      logEvents(`${error.name}: ${error.message}`, 'scheduleErrorLogs.txt')
    }
  })
}
