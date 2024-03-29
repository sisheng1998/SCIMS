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
    callback(null, `./public/SDSs/${file.fieldname === 'SDS_EN' ? 'en' : 'bm'}`)
  },
  filename: (req, file, callback) => {
    let extension

    if (mime.extension(file.mimetype)) {
      extension = '.' + mime.extension(file.mimetype)
    } else {
      extension = '.pdf'
    }

    callback(null, JSON.parse(req.body.chemicalInfo).CASNo + extension)
  },
})

const uploadSDS = multer({ storage: SDSStorage })

const ticketAttachmentsStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/tickets')
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname)
  },
})

const uploadTicketAttachments = multer({ storage: ticketAttachmentsStorage })

const backupStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/backups')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  },
})

const uploadBackup = multer({ storage: backupStorage })

module.exports = {
  uploadAvatar,
  uploadSDS,
  uploadTicketAttachments,
  uploadBackup,
}
