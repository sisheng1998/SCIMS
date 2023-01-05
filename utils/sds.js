const fs = require('fs')
const path = require('path')

const getSDSs = (CASNo) => {
  const SDSName = `${CASNo}.pdf`
  const noSDS = 'No SDS'

  const isEnSDSExisted = checkSDSExists('en', CASNo)
  const isBmSDSExisted = checkSDSExists('bm', CASNo)

  const SDSs = {
    en: isEnSDSExisted ? SDSName : noSDS,
    bm: isBmSDSExisted ? SDSName : noSDS,
  }

  return SDSs
}

const checkSDSExists = (language, CASNo) =>
  fs.existsSync(
    path.resolve(__dirname, `../public/SDSs/${language}/${CASNo}.pdf`)
  )

const renameSDS = (language, oldCASNo, newCASNo) =>
  fs.renameSync(
    path.resolve(__dirname, `../public/SDSs/${language}/${oldCASNo}.pdf`),
    path.resolve(__dirname, `../public/SDSs/${language}/${newCASNo}.pdf`)
  )

module.exports = { getSDSs, checkSDSExists, renameSDS }
