// Only allow domains to connect with the API
const allowedOrigins = [
	process.env.DOMAIN_NAME,
	`${process.env.DOMAIN_NAME}/`,
	'http://127.0.0.1:3000/',
	'http://localhost:5000',
	`http://localhost:${process.env.PORT || 5000}/`,
	`http://127.0.0.1:${process.env.PORT || 5000}/`,
]

module.exports = allowedOrigins
