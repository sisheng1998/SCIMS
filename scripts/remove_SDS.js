// Start DB and run "node scripts/remove_SDS.js"
// Remove "SDS: String," from models/CAS after run script

require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose')
const connectDB = require('../config/db')

const CAS = require('../models/CAS')
const { startSession } = require('mongoose')

// Connect DB
connectDB()

const runScript = async () => {
  const session = await startSession()

  try {
    session.startTransaction()

    await CAS.updateMany(
      {},
      {
        $unset: { SDS: '' },
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    console.log('Done!')
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    console.log(error.message)
  }

  mongoose.connection.close()
}

mongoose.connection.once('open', () => {
  runScript()

  process.on('unhandledRejection', (error, promise) => {
    console.log(error.message)
    server.close(() => process.exit(1))
  })
})
