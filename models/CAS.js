const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CASSchema = new Schema(
	{
		CASNo: {
			type: String,
			required: true,
			unique: true,
		},
		SDS: String,
		classifications: [String],
		COCs: [String],
	},
	{ collection: 'cas' }
)

const CAS = mongoose.model('CAS', CASSchema)

module.exports = CAS
