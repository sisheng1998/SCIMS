const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LabSchema = new Schema(
	{
		labName: {
			type: String,
			required: true,
			unique: true,
		},
		labOwner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		labUsers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		chemicals: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Chemical',
			},
		],
		locations: [
			{
				name: String,
				status: {
					type: String,
					default: 'In Use',
				},
			},
		],
		status: {
			type: String,
			default: 'In Use',
		},
		createdAt: {
			type: Date,
			immutable: true,
			default: Date.now,
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: 'labs' }
)

const Lab = mongoose.model('Lab', LabSchema)

module.exports = Lab
