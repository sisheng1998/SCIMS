const mongoose = require('mongoose')
const logEvents = require('../middleware/logEvents')

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
	} catch (error) {
		logEvents(`${error.name}: ${error.message}`, 'dbErrorLogs.txt')
	}
}

module.exports = connectDB
