// Start DB and run "node scripts/change_storage_standard.js"
// Add "storageGroup: String," to models/chemical and remove after run script
// Add "storageGroups: [String]," to models/lab and remove after run script

require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose')
const connectDB = require('../config/db')

const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const STORAGE_CLASSES = require('../config/storage_classes')
const { startSession } = require('mongoose')

// Connect DB
connectDB()

const runScript = async () => {
  const session = await startSession()

  try {
    session.startTransaction()

    await Lab.updateMany(
      {},
      {
        $unset: { 'locations.$[].storageGroups': '' },
        $set: {
          'locations.$[].storageClasses': STORAGE_CLASSES,
        },
      },
      { session }
    )

    await Chemical.updateMany(
      {},
      {
        $unset: { storageGroup: '' },
        $set: {
          storageClass: '',
        },
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
