const ROLES_LIST = require('../config/roles_list')

const allLabs = {
  lab: 'All Labs',
  role: ROLES_LIST.guest,
  status: 'Active',
  _id: 'All Labs',
}

const admin = {
  lab: 'Admin',
  role: ROLES_LIST.admin,
  status: 'Active',
  _id: 'Admin',
}

const verifyRoles = (minRoles) => {
  return (req, res, next) => {
    if (!req?.user) return res.sendStatus(401)

    const isAdmin = req.user.isAdmin ? true : false

    if (isAdmin) {
      res.locals.user = admin
    } else {
      if (req.body.labId === 'All Labs') {
        res.locals.user = allLabs
      } else {
        res.locals.user = req.user.roles.find(
          (lab) => lab.lab._id.toString() === req.body.labId
        )
      }
    }

    const result = res.locals.user.role >= minRoles

    if (!result) return res.sendStatus(401)

    next()
  }
}

module.exports = verifyRoles
