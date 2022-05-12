require('dotenv').config({ path: './config.env' })
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const { verifyUser } = require('./middleware/verifyUser')
const logEvents = require('./middleware/logEvents')
const scheduleJobs = require('./controllers/schedule')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()

// Connect DB
connectDB()

// Handle options credentials check - before CORS
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Serve public files
app.use('/public', express.static('public'))
//app.use(express.static('client/build')) // Uncomment this for live site

// Connecting Routes - Comment this for live site
app.get('/', (req, res, next) => {
	res.status(200).send('API running.')
})

// Public Route
app.use('/api/auth', require('./routes/auth'))

// Private Route
app.use('/api/private', verifyUser, require('./routes/private'))
app.use('/api/admin', verifyUser, require('./routes/admin'))
app.use('/api/subscribe', verifyUser, require('./routes/subscribe'))

// Comment this for live site
app.get('*', (req, res) => {
	res.sendStatus(404)
})

// Let React Handle UI - Uncomment this for live site
//app.get('*', (req, res) => {
//	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//})

// Error Handler (should be last piece of middleware)
app.use(errorHandler)

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')

	const server = app.listen(PORT, () => {
		console.log(`Server running on Port ${PORT}`)

		// Scheduled Jobs
		scheduleJobs()
	})

	process.on('unhandledRejection', (err, promise) => {
		logEvents(`${err.name}: ${err.message}`, 'connectionErrorLogs.txt')
		server.close(() => process.exit(1))
	})
})
