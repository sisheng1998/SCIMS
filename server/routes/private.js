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
	getChemicalInfo,
	updateAmount,
	disposeChemical,
	cancelDisposal,
	getCASInfo,
} = require('../controllers/chemical')

const {
	getProfile,
	updateProfile,
	changeEmail,
	changePassword,
	updateAvatar,
} = require('../controllers/profile')

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
router
	.route('/chemical')
	.post(
		verifyRoles(ROLES_LIST.postgraduate),
		uploadSDS.single('SDS'),
		addChemical
	)
router
	.route('/chemical')
	.put(verifyRoles(ROLES_LIST.postgraduate), updateChemical)
router
	.route('/chemical/:chemicalId')
	.put(verifyRoles(ROLES_LIST.guest), getChemicalInfo)
router
	.route('/chemical/usage')
	.post(verifyRoles(ROLES_LIST.undergraduate), updateAmount)
router
	.route('/chemical/dispose')
	.post(verifyRoles(ROLES_LIST.labOwner), disposeChemical)
router
	.route('/chemical/cancel-disposal')
	.post(verifyRoles(ROLES_LIST.labOwner), cancelDisposal)
router.route('/cas').put(getCASInfo)

// Profile
router.route('/profile').get(getProfile)
router.route('/profile').post(updateProfile)
router.route('/profile/email').post(changeEmail)
router.route('/profile/password').post(changePassword)
router
	.route('/profile/avatar')
	.post(uploadAvatar.single('avatar'), updateAvatar)

// Settings
router.route('/location').post(verifyRoles(ROLES_LIST.labOwner), addLocation)
router.route('/location').put(verifyRoles(ROLES_LIST.labOwner), editLocation)
router
	.route('/location')
	.delete(verifyRoles(ROLES_LIST.labOwner), removeLocation)
router.route('/lab').put(verifyRoles(ROLES_LIST.labOwner), editLab)

module.exports = router
