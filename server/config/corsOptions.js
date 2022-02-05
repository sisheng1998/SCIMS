/*
	TODO (for Production Environment):
	Add new domain name to whiteList
	Remove 'localhost', '127.0.0.1'
	Remove '|| !origin' from if statement
*/

// Only allow domains to connect with the API
const whiteList = [
	'http://localhost:3000/',
	'http://127.0.0.1:3000/',
	`http://localhost:${process.env.PORT || 5000}/`,
	`http://127.0.0.1:${process.env.PORT || 5000}/`,
]

const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS.'))
		}
	},
	optionsSuccessStatus: 200,
}

module.exports = corsOptions
