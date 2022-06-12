const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema(
	{
		lab: {
			type: Schema.Types.ObjectId,
			ref: 'Lab',
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		chemical: {
			type: Schema.Types.ObjectId,
			ref: 'Chemical',
		},
		requestor: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		type: String,
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: 'notifications' }
)

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification
