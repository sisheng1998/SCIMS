const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req?.user) return res.sendStatus(401)

		const rolesArray = [...allowedRoles]
		const result = req.user.roles
			.map((lab) => rolesArray.includes(lab.role))
			.find((val) => val === true)

		if (!result) return res.sendStatus(401)
		next()
	}
}

module.exports = verifyRoles
