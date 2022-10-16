const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivitySchema = new Schema(
  {
    lab: {
      type: Schema.Types.ObjectId,
      ref: 'Lab',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    chemical: {
      type: Schema.Types.ObjectId,
      ref: 'Chemical',
    },
    description: String,
    changes: String,
    importLog: Object,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'activities' }
)

const Activity = mongoose.model('Activity', ActivitySchema)

module.exports = Activity
