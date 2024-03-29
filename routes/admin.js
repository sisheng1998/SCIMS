const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')
const { uploadBackup } = require('../middleware/uploadFile')

const {
  getInfo,
  getLabs,
  addLab,
  addLabWithExistingUser,
  updateLab,
  removeLab,
  getUsers,
  getBackups,
  createBackup,
  restoreBackup,
  uploadAndRestoreBackup,
  deleteBackup,
  getServerLogs,
  getServerLog,
  deleteServerLog,
  getSettings,
  updateSettings,
  sendTestEmail,
} = require('../controllers/admin')

// Dashboard
router.route('/dashboard').get(verifyRoles(ROLES_LIST.admin), getInfo)

// Labs
router.route('/labs').get(verifyRoles(ROLES_LIST.admin), getLabs)
router.route('/lab').post(verifyRoles(ROLES_LIST.admin), addLab)
router
  .route('/lab-existing-user')
  .post(verifyRoles(ROLES_LIST.admin), addLabWithExistingUser)
router.route('/lab').put(verifyRoles(ROLES_LIST.admin), updateLab)
router.route('/lab').delete(verifyRoles(ROLES_LIST.admin), removeLab)

// Users
router.route('/users').get(verifyRoles(ROLES_LIST.admin), getUsers)

// Backup / Restore
router.route('/backups').get(verifyRoles(ROLES_LIST.admin), getBackups)
router.route('/backup/create').post(verifyRoles(ROLES_LIST.admin), createBackup)
router
  .route('/backup/restore')
  .post(verifyRoles(ROLES_LIST.admin), restoreBackup)
router
  .route('/backup/upload-and-restore')
  .post(
    verifyRoles(ROLES_LIST.admin),
    uploadBackup.single('backup'),
    uploadAndRestoreBackup
  )
router
  .route('/backup/delete')
  .delete(verifyRoles(ROLES_LIST.admin), deleteBackup)

// Server Logs
router.route('/server-logs').get(verifyRoles(ROLES_LIST.admin), getServerLogs)
router
  .route('/server-log/:filename')
  .get(verifyRoles(ROLES_LIST.admin), getServerLog)
router
  .route('/server-log/delete')
  .delete(verifyRoles(ROLES_LIST.admin), deleteServerLog)

// Setting
router.route('/settings').get(verifyRoles(ROLES_LIST.admin), getSettings)
router.route('/settings').put(verifyRoles(ROLES_LIST.admin), updateSettings)
router
  .route('/settings/test-email')
  .put(verifyRoles(ROLES_LIST.admin), sendTestEmail)

module.exports = router
