const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CASSchema = new Schema(
  {
    CASNo: {
      type: String,
      required: true,
      unique: true,
    },
    chemicalName: String,
    SDS: String,
    classifications: [String],
    COCs: [String],
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'cas' }
)

const CAS = mongoose.model('CAS', CASSchema)

module.exports = CAS
