const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const logEvents = require('../middleware/logEvents')
const isLiveSite = false // Change this for live site or dev site

// Backup command: mongodump --uri="MONGO_URI" --db="DB_NAME" --archive="BACKUP_PATH.gzip" --gzip
// Restore command: mongorestore --uri="MONGO_URI" --nsInclude="DB_NAME.*" --archive="BACKUP_PATH.gzip" --gzip

const backupDatabase = (type = 'auto', isSync = false, resolve) => {
  const DB_NAME = isLiveSite ? 'app' : 'dev'
  const URI = process.env.MONGO_URI
  const DATE = getDate()
  const FILE_NAME = `${DATE}_scims-backup.gzip`
  const ARCHIVE_PATH = path.resolve(
    __dirname,
    `../public/backups/${type}/${FILE_NAME}`
  )

  const child = spawn('mongodump', [
    `--uri=${URI}`,
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip',
  ])

  let success = false
  let output = `Backup (${type}) start:\n`

  child.stdout.on('data', (data) => {
    output += `${data.toString()}`
  })

  child.stderr.on('data', (data) => {
    output += `${Buffer.from(data).toString()}`
  })

  child.on('error', (error) => {
    output += `${error.name}: ${error.message}`
  })

  child.on('exit', (code, signal) => {
    if (code) {
      output += `Backup process exited with code ${code}\n`
    } else if (signal) {
      output += `Backup process was killed with signal ${signal}\n`
    } else {
      output += 'Backup successfully.\n'
      success = true
    }

    logEvents(output, 'backupLogs.txt')

    if (success) {
      if (isSync) {
        const backup = {
          name: FILE_NAME,
        }

        if (fs.existsSync(ARCHIVE_PATH)) {
          const stats = fs.statSync(ARCHIVE_PATH)

          backup.size = stats.size
          backup.date = stats.birthtime
        }

        resolve(backup)
      }
    } else {
      if (fs.existsSync(ARCHIVE_PATH)) {
        fs.unlinkSync(ARCHIVE_PATH)
      }

      if (isSync) {
        resolve('error')
      }
    }
  })
}

const backupDatabaseSync = (type = 'auto') =>
  new Promise((resolve, reject) => {
    backupDatabase(type, true, resolve)
  })

const getDate = () => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const hours = String(today.getHours()).padStart(2, '0')
  const minutes = String(today.getMinutes()).padStart(2, '0')
  const seconds = String(today.getSeconds()).padStart(2, '0')

  const date = `${year}${month}${day}-${hours}${minutes}${seconds}`
  return date
}

module.exports = { backupDatabase, backupDatabaseSync }
