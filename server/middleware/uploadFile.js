const multer = require('multer')
const mime = require('mime-types')

const avatarStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/avatars')
	},
	filename: (req, file, callback) => {
		let extension

		if (mime.extension(file.mimetype)) {
			extension = '.' + mime.extension(file.mimetype)
		} else {
			extension = '.jpeg'
		}

		callback(null, req.user._id + extension)
	},
})

const uploadAvatar = multer({ storage: avatarStorage })

const SDSStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/SDSs')
	},
	filename: (req, file, callback) => {
		let extension

		if (mime.extension(file.mimetype)) {
			extension = '.' + mime.extension(file.mimetype)
		} else {
			extension = '.pdf'
		}

		callback(null, JSON.parse(req.body.chemicalInfo).CAS + extension)
	},
})

const uploadSDS = multer({ storage: SDSStorage })

module.exports = { uploadAvatar, uploadSDS }
