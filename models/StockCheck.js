const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StockCheckSchema = new Schema(
  {
    lab: {
      type: Schema.Types.ObjectId,
      ref: 'Lab',
    },
    status: {
      type: String,
      default: 'In Progress',
    },
    recordedChemicals: [
      {
        chemicalId: {
          type: Schema.Types.ObjectId,
          ref: 'Chemical',
        },
        CASNo: String,
        name: String,
        location: String,
        amount: Number,
        unit: String,
        amountInDB: Number,
        recordedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        recordedAt: Date,
      },
    ],
    missingChemicals: [
      {
        chemicalId: {
          type: Schema.Types.ObjectId,
          ref: 'Chemical',
        },
        CASNo: String,
        name: String,
        location: String,
        unit: String,
        amountInDB: Number,
      },
    ],
    kivChemicals: [
      {
        chemicalId: {
          type: Schema.Types.ObjectId,
          ref: 'Chemical',
        },
        CASNo: String,
        name: String,
        location: String,
        unit: String,
        amountInDB: Number,
      },
    ],
    disposedChemicals: [
      {
        chemicalId: {
          type: Schema.Types.ObjectId,
          ref: 'Chemical',
        },
        CASNo: String,
        name: String,
        location: String,
        unit: String,
        amountInDB: Number,
      },
    ],
    date: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
  },
  { collection: 'stockChecks' }
)

const StockCheck = mongoose.model('StockCheck', StockCheckSchema)

module.exports = StockCheck
