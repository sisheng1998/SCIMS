const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
  const today = new Date().toISOString()
  const logItem = `${today
    .replace('T', ' ')
    .substring(11, 19)} (UTC) - ${message}\n`

  if (!fs.existsSync(path.join(__dirname, '..', 'server_logs'))) {
    await fsPromises.mkdir(path.join(__dirname, '..', 'server_logs'))
  }

  await fsPromises.appendFile(
    path.join(
      __dirname,
      '..',
      'server_logs',
      today.slice(0, 10) + '_' + logName
    ),
    logItem
  )
}

module.exports = logEvents
