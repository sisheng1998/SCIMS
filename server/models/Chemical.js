const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChemicalSchema = new Schema(
	{
		casNo: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		unit: {
			type: String,
			required: true,
		},
		amount: {
			type: Double,
			required: true,
		},
		containerSize: {
			type: Double,
			required: true,
		},
		lab: {
			type: Schema.Types.ObjectId,
			ref: 'Lab',
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		location: {
			type: Schema.Types.ObjectId,
			ref: 'Location',
		},
		status: {
			type: String,
			default: 'Normal',
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
	{ collection: 'chemicals' }
)

const Chemical = mongoose.model('Chemical', ChemicalSchema)

module.exports = Chemical
