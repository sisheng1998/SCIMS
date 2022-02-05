/*
	TODO (for Production Environment):
	Add new domain name to allowedOrigins
	Remove 'localhost', '127.0.0.1'
	Remove '|| !origin' from if statement
*/

// Only allow domains to connect with the API
const allowedOrigins = [
	'http://localhost:3000/',
	'http://127.0.0.1:3000/',
	`http://localhost:${process.env.PORT || 5000}/`,
	`http://127.0.0.1:${process.env.PORT || 5000}/`,
]

module.exports = allowedOrigins
