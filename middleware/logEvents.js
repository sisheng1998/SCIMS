const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { getDate } = require('../utils/time')
const LOG_PATH = path.resolve(__dirname, '../server_logs')

const logEvents = async (message, logName) => {
  const DATE = getDate()
  const FILE_NAME = `${DATE.date}_${logName}`
  const LOG_ITEM = `${DATE.formattedTime} - ${message}\n`

  if (!fs.existsSync(LOG_PATH)) {
    await fsPromises.mkdir(LOG_PATH)
  }

  await fsPromises.appendFile(`${LOG_PATH}/${FILE_NAME}`, LOG_ITEM)
}

module.exports = logEvents
