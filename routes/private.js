const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')
const { uploadAvatar, uploadSDS } = require('../middleware/uploadFile')

const { getInfo } = require('../controllers/dashboard')

const {
  getUsers,
  addUser,
  userApproval,
  updateUser,
  removeUser,
  addExistingUser,
} = require('../controllers/user')

const {
  getChemicals,
  addChemical,
  updateChemical,
  updateCASNo,
  getChemicalInfo,
  getChemicalList,
  updateAmount,
  disposeChemical,
  cancelDisposal,
  deleteChemical,
  markAsKIV,
  removeFromKIV,
  getCASInfo,
  getAllCASNo,
} = require('../controllers/chemical')

const {
  getProfile,
  updateProfile,
  changeEmail,
  changePassword,
  completeProfile,
  updateAvatar,
} = require('../controllers/profile')

const { userActivity } = require('../controllers/activity_log')

const {
  getActiveStockCheck,
  startStockCheck,
  stockCheck,
  endStockCheck,
} = require('../controllers/stock_check')

const {
  usageReports,
  stockCheckReports,
  stockCheckReport,
} = require('../controllers/report')

const {
  getSDS,
  getSDSChemicals,
  addSDS,
  updateSDS,
  deleteSDS,
} = require('../controllers/sds')

const { getNotifications } = require('../controllers/notification')

const {
  importChemicals,
  exportChemicals,
} = require('../controllers/import_export')

const {
  addLocation,
  editLocation,
  removeLocation,
  editLab,
} = require('../controllers/settings')

// Dashboard
router.route('/dashboard').put(verifyRoles(ROLES_LIST.guest), getInfo)

// Users
router.route('/users').post(verifyRoles(ROLES_LIST.guest), getUsers)
router.route('/user').post(verifyRoles(ROLES_LIST.labOwner), addUser)
router
  .route('/user/approval')
  .post(verifyRoles(ROLES_LIST.labOwner), userApproval)
router
  .route('/existing-user')
  .post(verifyRoles(ROLES_LIST.labOwner), addExistingUser)
router.route('/user').put(verifyRoles(ROLES_LIST.labOwner), updateUser)
router.route('/user').delete(verifyRoles(ROLES_LIST.labOwner), removeUser)

// Inventory
router.route('/chemicals').post(verifyRoles(ROLES_LIST.guest), getChemicals)
router.route('/chemical').post(
  uploadSDS.fields([
    {
      name: 'SDS_EN',
      maxCount: 1,
    },
    {
      name: 'SDS_BM',
      maxCount: 1,
    },
  ]),
  addChemical
)
router
  .route('/chemical')
  .put(verifyRoles(ROLES_LIST.postgraduate), updateChemical)
router
  .route('/chemical/:chemicalId/cas')
  .patch(verifyRoles(ROLES_LIST.postgraduate), updateCASNo)
router
  .route('/chemical/:chemicalId')
  .put(verifyRoles(ROLES_LIST.guest), getChemicalInfo)
router
  .route('/chemical-list')
  .post(verifyRoles(ROLES_LIST.guest), getChemicalList)
router
  .route('/chemical/usage')
  .post(verifyRoles(ROLES_LIST.undergraduate), updateAmount)
router
  .route('/chemical/dispose')
  .post(verifyRoles(ROLES_LIST.labOwner), disposeChemical)
router
  .route('/chemical/cancel-disposal')
  .post(verifyRoles(ROLES_LIST.labOwner), cancelDisposal)
router
  .route('/chemical/delete')
  .post(verifyRoles(ROLES_LIST.labOwner), deleteChemical)
router
  .route('/chemical/mark-as-kiv')
  .post(verifyRoles(ROLES_LIST.postgraduate), markAsKIV)
router
  .route('/chemical/remove-from-kiv')
  .post(verifyRoles(ROLES_LIST.postgraduate), removeFromKIV)
router.route('/cas').get(getAllCASNo)
router.route('/cas').put(getCASInfo)

// Profile
router.route('/profile').get(getProfile)
router.route('/profile').post(updateProfile)
router.route('/profile/email').post(changeEmail)
router.route('/profile/password').post(changePassword)
router
  .route('/profile/complete-profile')
  .post(uploadAvatar.single('avatar'), completeProfile)
router
  .route('/profile/avatar')
  .post(uploadAvatar.single('avatar'), updateAvatar)

// Activity Logs
router
  .route('/activity-logs')
  .put(verifyRoles(ROLES_LIST.labOwner), userActivity)

// Stock Check
router
  .route('/stock-check/active')
  .post(verifyRoles(ROLES_LIST.postgraduate), getActiveStockCheck)
router
  .route('/stock-check/start')
  .post(verifyRoles(ROLES_LIST.labOwner), startStockCheck)
router
  .route('/stock-check')
  .post(verifyRoles(ROLES_LIST.postgraduate), stockCheck)
router
  .route('/stock-check/end')
  .patch(verifyRoles(ROLES_LIST.labOwner), endStockCheck)

// Reports
router
  .route('/usage-reports')
  .put(verifyRoles(ROLES_LIST.labOwner), usageReports)
router
  .route('/stock-check-reports')
  .put(verifyRoles(ROLES_LIST.postgraduate), stockCheckReports)
router
  .route('/reports/:reportId')
  .put(verifyRoles(ROLES_LIST.postgraduate), stockCheckReport)

// SDS
router.route('/sds').get(getSDS)
router.route('/sds/:CASId').patch(
  uploadSDS.fields([
    {
      name: 'SDS_EN',
      maxCount: 1,
    },
    {
      name: 'SDS_BM',
      maxCount: 1,
    },
  ]),
  updateSDS
)
router.route('/sds/new-sds').post(
  uploadSDS.fields([
    {
      name: 'SDS_EN',
      maxCount: 1,
    },
    {
      name: 'SDS_BM',
      maxCount: 1,
    },
  ]),
  addSDS
)
router.route('/sds/:CASId/chemicals').get(getSDSChemicals)
router.route('/sds/:CASId').delete(deleteSDS)

// Notifications
router.route('/notifications').get(getNotifications)

// Import/Export
router.route('/import').post(verifyRoles(ROLES_LIST.labOwner), importChemicals)
router.route('/export').post(verifyRoles(ROLES_LIST.labOwner), exportChemicals)

// Settings
router.route('/location').post(verifyRoles(ROLES_LIST.labOwner), addLocation)
router.route('/location').put(verifyRoles(ROLES_LIST.labOwner), editLocation)
router
  .route('/location')
  .delete(verifyRoles(ROLES_LIST.labOwner), removeLocation)
router.route('/lab').put(verifyRoles(ROLES_LIST.labOwner), editLab)

module.exports = router
