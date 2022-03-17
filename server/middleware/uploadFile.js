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

module.exports = { uploadAvatar }
