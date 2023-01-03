const fs = require('fs')
const path = require('path')

const getSDS = (language, CASNo) => {
  const isSDSExisted = fs.existsSync(
    path.resolve(__dirname, `../public/SDSs/${language}/${CASNo}.pdf`)
  )

  return isSDSExisted ? `${CASNo}.pdf` : 'No SDS'
}

module.exports = getSDS
