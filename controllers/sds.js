const ErrorResponse = require('../utils/errorResponse')
const CAS = require('../models/CAS')
const { startSession } = require('mongoose')

exports.getSDS = async (req, res, next) => {
  try {
    const SDS = await CAS.find({}).sort({ CASNo: 1 })

    res.status(200).json({
      success: true,
      data: SDS,
    })
  } catch (error) {
    next(error)
  }
}

exports.addSDS = async (req, res, next) => {
  const { CASNo, chemicalName, classifications, COCs } = JSON.parse(
    req.body.chemicalInfo
  )

  if (!CASNo || !chemicalName) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundCAS = await CAS.findOne({ CASNo })
  if (foundCAS) {
    return next(new ErrorResponse('SDS existed.', 409))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await CAS.create(
      [
        {
          CASNo,
          chemicalName,
          SDS: req.file.filename,
          classifications,
          COCs,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'New SDS added.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.updateSDS = async (req, res, next) => {
  const { CASNo, chemicalName, classifications, COCs } = JSON.parse(
    req.body.chemicalInfo
  )

  if (!CASNo || !chemicalName) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundCAS = await CAS.findOne({ CASNo })
  if (!foundCAS) {
    return next(new ErrorResponse('SDS not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const updateQuery = {
      chemicalName,
      classifications,
      COCs,
      lastUpdated: Date.now(),
    }

    if (req.file !== undefined) {
      updateQuery.SDS = req.file.filename
    }

    await CAS.updateOne(
      foundCAS,
      {
        $set: updateQuery,
      },
      { new: true, session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'SDS updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
