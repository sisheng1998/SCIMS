const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Activity = require('../models/Activity')
const Usage = require('../models/Usage')

const UserOption = 'name email avatar'
const ChemicalOption = 'name'

exports.userActivity = async (req, res, next) => {
  const { labId } = req.body

  if (!labId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  try {
    const foundLab = await Lab.findById(labId)
    if (!foundLab) {
      return next(new ErrorResponse('Lab not found.', 404))
    }

    const usages = await Usage.find({ lab: labId })
      .populate('user', UserOption)
      .populate('chemical', ChemicalOption)

    const activities = await Activity.find({ lab: labId })
      .populate('user', UserOption)
      .populate('chemical', ChemicalOption)

    res.status(200).json({
      success: true,
      data: [...usages, ...activities],
    })
  } catch (error) {
    next(error)
  }
}
