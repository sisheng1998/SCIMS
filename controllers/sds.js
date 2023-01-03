const ErrorResponse = require('../utils/errorResponse')
const CAS = require('../models/CAS')
const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')
const path = require('path')
const getSDS = require('../utils/getSDS')

exports.getSDS = async (req, res, next) => {
  try {
    const SDSs = await CAS.find({}).sort({ CASNo: 1 })

    const allSDSs = SDSs.map((SDS) => {
      const CASNo = SDS.CASNo

      const enSDS = getSDS('en', CASNo)
      const bmSDS = getSDS('bm', CASNo)

      return {
        ...SDS._doc,
        SDSs: {
          en: enSDS,
          bm: bmSDS,
        },
      }
    })

    res.status(200).json({
      success: true,
      data: allSDSs,
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

        const isEnSDSExisted = fs.existsSync(
          path.resolve(__dirname, `../public/SDSs/en/${foundCAS.CASNo}.pdf`)
        )

        if (isEnSDSExisted) {
          fs.renameSync(
            path.resolve(__dirname, `../public/SDSs/en/${foundCAS.CASNo}.pdf`),
            path.resolve(__dirname, `../public/SDSs/en/${CASNo}.pdf`)
          )
        }

        const isBmSDSExisted = fs.existsSync(
          path.resolve(__dirname, `../public/SDSs/bm/${foundCAS.CASNo}.pdf`)
        )

        if (isBmSDSExisted) {
          fs.renameSync(
            path.resolve(__dirname, `../public/SDSs/bm/${foundCAS.CASNo}.pdf`),
            path.resolve(__dirname, `../public/SDSs/bm/${CASNo}.pdf`)
          )
        }
      }
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
