const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubscriberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    endpoint: String,
    keys: Schema.Types.Mixed,
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'subscribers' }
)

const Subscriber = mongoose.model('Subscriber', SubscriberSchema)

module.exports = Subscriber
