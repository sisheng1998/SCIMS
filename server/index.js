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

// Connecting Routes
app.get('/', (req, res, next) => {
	res.status(200).send('API running.')
})

// Public Route
app.use('/api/auth', require('./routes/auth'))

// Private Route
app.use(verifyUser)
app.use('/api/private', require('./routes/private'))
app.use('/api/admin', require('./routes/admin'))

app.all('*', (req, res) => {
	res.sendStatus(404)
})

// Error Handler (should be last piece of middleware)
app.use(errorHandler)

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')

	const server = app.listen(PORT, () =>
		console.log(`Server running on Port ${PORT}`)
	)

	process.on('unhandledRejection', (err, promise) => {
		console.log(`(Error) ${err}`)
		server.close(() => process.exit(1))
	})
})
