const verifyRoles = (minRoles) => {
	return (req, res, next) => {
		if (!req?.user) return res.sendStatus(401)

		const result = req.user.roles.find(
			(lab) => lab.lab._id.toString() === req.body.labId && lab.role >= minRoles
		)

		if (!result) return res.sendStatus(401)
		next()
	}
}

module.exports = verifyRoles
