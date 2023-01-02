const ErrorResponse = require('../utils/errorResponse')
const CAS = require('../models/CAS')
const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')
const path = require('path')

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
  const CASId = ObjectId(req.params.CASId)

  const { CASNo, chemicalName, classifications, COCs } = JSON.parse(
    req.body.chemicalInfo
  )

  if (!CASNo || !chemicalName) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const foundCAS = await CAS.findById(CASId)
    if (!foundCAS) {
      return next(new ErrorResponse('SDS not found.', 404))
    }

    const updateQuery = {
      chemicalName,
      classifications,
      COCs,
      lastUpdated: Date.now(),
    }

    if (CASNo !== foundCAS.CASNo) {
      const existedCAS = await CAS.findOne({ CASNo })

      if (existedCAS) {
        return next(new ErrorResponse('CAS No. existed.', 409))
      } else {
        updateQuery.CASNo = CASNo

        const isSDSExisted = fs.existsSync(
          path.resolve(__dirname, `../public/SDSs/${foundCAS.CASNo}.pdf`)
        )

        if (isSDSExisted) {
          updateQuery.SDS = CASNo + '.pdf'

          fs.renameSync(
            path.resolve(__dirname, `../public/SDSs/${foundCAS.CASNo}.pdf`),
            path.resolve(__dirname, `../public/SDSs/${CASNo}.pdf`)
          )
        }
      }
    }

    if (req.file !== undefined) {
      updateQuery.SDS = req.file.filename
    }

    await CAS.updateOne(
      { _id: foundCAS._id },
      {
        $set: updateQuery,
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(204).json({
      success: true,
      data: 'SDS updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
