const verifyRoles = (minRoles) => {
	return (req, res, next) => {
		if (!req?.user) return res.sendStatus(401)

		res.locals.user = req.user.roles.find(
			(lab) => lab.lab._id.toString() === req.body.labId
		)

		const result = res.locals.user.role >= minRoles

		if (!result) return res.sendStatus(401)
		next()
	}
}

module.exports = verifyRoles
