const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const logEvents = require('../middleware/logEvents')
const { getDateString, duration } = require('./time')
const isLiveSite = false // Change this for live site or dev site

// Backup command: mongodump --uri="MONGO_URI" --db="DB_NAME" --archive="BACKUP_PATH.gz" --gzip --verbose
// Restore command: mongorestore --uri="MONGO_URI" --nsInclude="DB_NAME.*" --archive="BACKUP_PATH.gz" --gzip --objcheck --drop --verbose

const backupDatabase = (type = 'auto', isSync = false, resolve) => {
  const DB_NAME = isLiveSite ? 'app' : 'dev'
  const URI = process.env.MONGO_URI
  const DATE = getDateString()
  const FILE_NAME = `${DATE}_scims-backup.gz`
  const ARCHIVE_PATH = path.resolve(
    __dirname,
    `../public/backups/${type}/${FILE_NAME}`
  )

  const child = spawn('mongodump', [
    `--uri=${URI}`,
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip',
    '--verbose',
  ])

  let success = false
  let output = `Backup process (${type}) started:\n`

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
      output += 'Backup process successfully.\n'
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
      deleteFile(ARCHIVE_PATH, FILE_NAME, false)
      isSync && resolve('error')
    }
  })
}

const backupDatabaseSync = (type = 'auto') =>
  new Promise((resolve, reject) => {
    backupDatabase(type, true, resolve)
  })

const restoreDatabaseSync = (type, filename) =>
  new Promise((resolve, reject) => {
    const isUploadedBackup = type === ''

    const DB_NAME = isLiveSite ? 'app' : 'dev'
    const URI = process.env.MONGO_URI
    const ARCHIVE_PATH = isUploadedBackup
      ? path.resolve(__dirname, `../public/backups/${filename}`)
      : path.resolve(__dirname, `../public/backups/${type}/${filename}`)

    const child = spawn('mongorestore', [
      `--uri=${URI}`,
      `--nsInclude=${DB_NAME}.*`,
      `--archive=${ARCHIVE_PATH}`,
      '--gzip',
      '--objcheck',
      '--drop',
      '--verbose',
    ])

    let success = false
    let output = `Restoration process started (${filename}):\n`

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
        output += `Restoration process exited with code ${code}\n`
      } else if (signal) {
        output += `Restoration process was killed with signal ${signal}\n`
      } else {
        output += 'Restoration process successfully.\n'
        success = true
      }

      logEvents(output, 'restorationLogs.txt')

      if (isUploadedBackup) {
        deleteFile(ARCHIVE_PATH, filename, false)
      }

      resolve(success ? 'success' : 'error')
    })
  })

const deleteOldAutoBackups = (maxDays = 30) => {
  const autoBackupPath = path.resolve(__dirname, '../public/backups/auto/')
  const now = new Date().getTime()

  fs.readdirSync(autoBackupPath).forEach((file) => {
    const filePath = `${autoBackupPath}/${file}`

    if (path.extname(file) !== '.gz') {
      deleteFile(filePath, file, true)
      return
    }

    const stats = fs.statSync(filePath)
    const endTime =
      new Date(stats.birthtime).getTime() + duration.days(maxDays - 1)

    if (now > endTime) {
      deleteFile(filePath, file, true)
    }
  })
}

const deleteFile = (filePath, filename, writeToLog) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath, (error) => {
      if (error) {
        writeToLog &&
          logEvents(`Backup deletion failed. (${filename})\n`, 'backupLogs.txt')
      }
    })

    writeToLog && logEvents(`Backup deleted. (${filename})\n`, 'backupLogs.txt')
  } else {
    writeToLog &&
      logEvents(`Backup not found. (${filename})\n`, 'backupLogs.txt')
  }
}

module.exports = {
  backupDatabase,
  backupDatabaseSync,
  restoreDatabaseSync,
  deleteOldAutoBackups,
}
