// Start DB and run "node scripts/init.js"

require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose')
const connectDB = require('../config/db')

const Lab = require('../models/Lab')
const User = require('../models/User')
const Config = require('../models/Config')
const init = require('../config/init.json')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')

// Connect DB
connectDB()

const runScript = async () => {
  try {
    const config = await Config.countDocuments({})

    if (config === 0) {
      await Config.create([{}])
    }

    const users = await User.countDocuments({})

    if (users === 0) {
      if (
        !init.name ||
        !init.email ||
        !init.matricNo ||
        !init.password ||
        !init.labName
      ) {
        console.log('Missing value for required field.')
        return
      }

      const session = await startSession()

      try {
        session.startTransaction()

        const lab = await Lab.create(
          [
            {
              labName: init.labName,
            },
          ],
          { session }
        )

        const user = await User.create(
          [
            {
              name: init.name,
              matricNo: init.matricNo,
              email: init.email,
              password: init.password,
              roles: {
                lab: lab[0]._id,
                role: ROLES_LIST.labOwner,
                status: 'Active',
              },
              isAdmin: true,
              isEmailVerified: true,
            },
          ],
          { session }
        )

        await Lab.updateOne(
          lab[0],
          {
            $set: {
              labOwner: user[0]._id,
            },
          },
          { new: true, session }
        )

        await session.commitTransaction()
        session.endSession()
      } catch (error) {
        await session.abortTransaction()
        session.endSession()

        console.log(error.message)
      }
    }

    console.log('Done!')
  } catch (error) {
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
