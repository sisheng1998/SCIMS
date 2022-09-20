const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigSchema = new Schema(
	{
		FROM_NAME: {
			type: String,
			default: 'Smart Chemical Inventory Management System',
		},
		FROM_EMAIL: {
			type: String,
			default: 'scims@domain.com',
		},
		EMAIL_USERNAME: {
			type: String,
			default: 'scims@domain.com',
		},
		EMAIL_PASSWORD: {
			type: String,
			default: 'emailPassword1234!',
		},
		DAY_BEFORE_EXP: {
			type: Number,
			default: 30,
		},
	},
	{ collection: 'config', capped: { size: 1024, max: 1 } }
)

const Config = mongoose.model('Config', ConfigSchema)

module.exports = Config
