const ROLES_LIST = require('../config/roles_list')

const verifyRoles = (minRoles) => {
	return (req, res, next) => {
		if (!req?.user) return res.sendStatus(401)

		const isAdmin = req.user.roles.filter(
			(role) => role.role === ROLES_LIST.admin && role.status === 'Active'
		)

		if (isAdmin.length !== 0) {
			res.locals.user = isAdmin[0]
		} else {
			res.locals.user = req.user.roles.find(
				(lab) => lab.lab._id.toString() === req.body.labId
			)
		}

		const result = res.locals.user.role >= minRoles

		if (!result) return res.sendStatus(401)

		next()
	}
}

module.exports = verifyRoles
