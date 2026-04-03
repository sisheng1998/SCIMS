// Start DB and run "node scripts/update_matric_no_index.js"

require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose')
const connectDB = require('../config/db')

const User = require('../models/User')

// Connect DB
connectDB()

const runScript = async () => {
  try {
    console.log('================ BEFORE =================')

    const beforeIndexes = await User.collection.indexes()
    console.log(JSON.stringify(beforeIndexes, null, 2))

    console.log('\nChecking for old matricNo_1 index...')

    const matricIndex = beforeIndexes.find(
      (index) => index.name === 'matricNo_1'
    )

    if (matricIndex) {
      console.log('Dropping old matricNo_1 index...')
      await User.collection.dropIndex('matricNo_1')
      console.log('Old index dropped ✅')
    } else {
      console.log('No old index found ✅')
    }

    console.log('\nCreating new partial index...')

    await User.collection.createIndex(
      { matricNo: 1 },
      {
        unique: true,
        partialFilterExpression: {
          matricNo: { $type: 'string' },
        },
      }
    )

    console.log('New index created ✅')

    console.log('\n================ AFTER =================')

    const afterIndexes = await User.collection.indexes()
    console.log(JSON.stringify(afterIndexes, null, 2))

    console.log('\nDone! 🎉')
  } catch (error) {
    console.log('Error:', error.message)
  } finally {
    mongoose.connection.close()
  }
}

mongoose.connection.once('open', () => {
  runScript()

  process.on('unhandledRejection', (error, promise) => {
    console.log(error.message)
    server.close(() => process.exit(1))
  })
})
