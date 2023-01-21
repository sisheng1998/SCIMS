const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
  const today = new Date().toISOString()
  const logItem = `${today
    .replace('T', ' ')
    .substring(11, 19)} (UTC) - ${message}\n`

  const filename = today.slice(0, 10) + '_' + logName
  const logPath = path.resolve(__dirname, '../server_logs')

  if (!fs.existsSync(logPath)) {
    await fsPromises.mkdir(logPath)
  }

  await fsPromises.appendFile(`${logPath}/${filename}`, logItem)
}

module.exports = logEvents
