require('dotenv').config({ path: './config.env' })
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const express = require('express')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const { auth } = require('./middleware/auth')
const PORT = process.env.PORT || 5000

const app = express()

// Connect DB
connectDB()

// Handle options credentials check - before CORS
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Connecting Routes
app.get('/', (req, res, next) => {
	res.status(200).send('API running.')
})

// Public Route
app.use('/api/auth', require('./routes/auth'))

// Private Route
app.use(auth)
app.use('/api/private', require('./routes/private'))

// Error Handler (should be last piece of middleware)
app.use(errorHandler)

const server = app.listen(PORT, () =>
	console.log(`Server running on Port ${PORT}`)
)

process.on('unhandledRejection', (err, promise) => {
	console.log(`(Error) ${err}`)
	server.close(() => process.exit(1))
})
