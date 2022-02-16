const verifyRoles = (minRoles) => {
	return (req, res, next) => {
		if (!req?.user) return res.sendStatus(401)

		const result = req.user.roles
			.map((lab) => lab.role >= minRoles)
			.find((val) => val === true)

		if (!result) return res.sendStatus(401)
		next()
	}
}

module.exports = verifyRoles
