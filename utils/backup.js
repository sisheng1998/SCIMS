const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const logEvents = require('../middleware/logEvents')
const { getDateString, duration } = require('./time')
const isLiveSite = false // Change this for live site or dev site
const MAX_DAYS = 30

// Backup command: mongodump --uri="MONGO_URI" --db="DB_NAME" --archive="BACKUP_PATH.gzip" --gzip
// Restore command: mongorestore --uri="MONGO_URI" --nsInclude="DB_NAME.*" --archive="BACKUP_PATH.gzip" --gzip

const backupDatabase = (type = 'auto', isSync = false, resolve) => {
  const DB_NAME = isLiveSite ? 'app' : 'dev'
  const URI = process.env.MONGO_URI
  const DATE = getDateString()
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
      deleteFile(ARCHIVE_PATH)

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

const deleteOldAutoBackups = () => {
  const autoBackupPath = path.resolve(__dirname, '../public/backups/auto/')
  const maxDuration = new Date().getTime() - duration.minutes(5 - 1)

  fs.readdirSync(autoBackupPath).forEach((file) => {
    const filePath = `${autoBackupPath}/${file}`

    if (path.extname(file) !== '.gzip') {
      deleteFile(filePath)
      return
    }

    const backupCreationTime = new Date(
      fs.statSync(filePath).birthtime
    ).getTime()

    const isOldBackup = backupCreationTime < maxDuration

    console.log('time diff:', backupCreationTime - maxDuration)

    if (isOldBackup) {
      deleteFile(filePath)
      logEvents(`Backup (${file}) deleted.\n`, 'backupLogs.txt')
    }
  })

  console.log('-------------------------------------------------------')
}

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

module.exports = { backupDatabase, backupDatabaseSync, deleteOldAutoBackups }
