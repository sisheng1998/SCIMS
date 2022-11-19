const ErrorResponse = require('../utils/errorResponse')
const Subscriber = require('../models/Subscriber')
const User = require('../models/User')
const sendNotification = require('../utils/sendNotification')
const { startSession } = require('mongoose')

exports.subscribe = async (req, res, next) => {
  const { endpoint, keys } = req.body

  if (!endpoint || !keys) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const subscribedUser = await Subscriber.findOne({ user: req.user._id })

  const foundUser = await User.findById(req.user._id)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    if (subscribedUser) {
      await Subscriber.updateOne(
        { _id: subscribedUser._id },
        {
          $set: {
            endpoint,
            keys,
            subscribedAt: Date.now(),
          },
        },
        { new: true, session }
      )
    } else {
      await Subscriber.create(
        [
          {
            user: req.user._id,
            endpoint,
            keys,
          },
        ],
        { session }
      )
    }

    await User.updateOne(
      { _id: foundUser._id },
      {
        $unset: {
          isUnsubscribed: '',
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Subscription saved.',
    })

    const subscription = { endpoint, keys }
    const payload = JSON.stringify({
      title: 'Notification Allowed',
      message:
        'Important notifications will be sent to this device in the future.',
      url: '/profile',
    })

    sendNotification(subscription, payload)
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.unsubscribe = async (req, res, next) => {
  const subscribedUser = await Subscriber.findOne({ user: req.user._id })
  if (!subscribedUser) {
    return next(new ErrorResponse('Subscriber not found.', 404))
  }

  const foundUser = await User.findById(req.user._id)
  if (!foundUser) {
    return next(new ErrorResponse('User not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await Subscriber.deleteOne({ _id: subscribedUser._id }, { session })

    await User.updateOne(
      { _id: foundUser._id },
      {
        $set: {
          isUnsubscribed: true,
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Subscription removed.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
