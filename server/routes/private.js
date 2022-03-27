const express = require('express')
const router = express.Router()

const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')
const { uploadAvatar, uploadSDS } = require('../middleware/uploadFile')

const {
	getUsers,
	addUser,
	updateUser,
	removeUser,
	addExistingUser,
} = require('../controllers/user')

const {
	getChemicals,
	addChemical,
	getChemicalInfo,
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
} = require('../controllers/settings')

// Users
router.route('/users').post(verifyRoles(ROLES_LIST.guest), getUsers)
router.route('/user').post(verifyRoles(ROLES_LIST.labOwner), addUser)
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
	.route('/chemical/:chemicalId')
	.put(verifyRoles(ROLES_LIST.guest), getChemicalInfo)

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

module.exports = router
