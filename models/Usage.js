const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsageSchema = new Schema(
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
    originalAmount: Number,
    usage: Number,
    unit: String,
    remark: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'usages' }
)

const Usage = mongoose.model('Usage', UsageSchema)

module.exports = Usage
