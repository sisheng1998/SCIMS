const QRCode = require('qrcode')

const generateQRCode = async (text) => {
	try {
		const base64QRCode = await QRCode.toDataURL(text.toString(), {
			margin: 0,
			width: 300,
		})
		return base64QRCode
	} catch (error) {
		return ''
	}
}

module.exports = generateQRCode
