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
		status: {
			type: String,
			default: 'In Use',
		},
	},
	{ collection: 'labs' }
)

const Lab = mongoose.model('Lab', LabSchema)

module.exports = Lab
