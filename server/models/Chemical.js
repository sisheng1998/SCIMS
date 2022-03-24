const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChemicalSchema = new Schema(
	{
		QRCode: String,
		CAS: {
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
			type: Number,
			required: true,
		},
		containerSize: {
			type: Number,
			required: true,
		},
		minAmount: {
			type: Number,
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
			ref: 'Lab',
		},
		storageGroup: String,
		status: {
			type: String,
			default: 'Normal',
		},
		dateIn: Date,
		dateOpen: Date,
		expirationDate: Date,
		SDS: String,
		classifications: [String],
		securities: [String],
		supplier: String,
		brand: String,
		notes: String,
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
