const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const { getSDSs, checkSDSExists, renameSDS } = require('../utils/sds')
const ErrorResponse = require('../utils/errorResponse')
const CAS = require('../models/CAS')
const Chemical = require('../models/Chemical')

exports.getSDS = async (req, res, next) => {
  try {
    const SDSs = await CAS.find({}).sort({ CASNo: 1 })

    const allSDSs = SDSs.map((SDS) => {
      const CASNo = SDS.CASNo
      const SDSs = getSDSs(CASNo)

      return {
        ...SDS._doc,
        SDSs,
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

exports.getSDSChemicals = async (req, res, next) => {
  const CASId = ObjectId(req.params.CASId)

  const foundCAS = await CAS.findById(CASId)
  if (!foundCAS) {
    return next(new ErrorResponse('SDS not found.', 404))
  }

  try {
    const chemicals = await Chemical.find(
      { CASId: foundCAS._id },
      'lab name'
    ).populate('lab', 'labName')

    chemicals.sort((a, b) => a.lab.labName.localeCompare(b.lab.labName))

    res.status(200).json({
      success: true,
      chemicals,
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

        const isEnSDSExisted = checkSDSExists('en', foundCAS.CASNo)
        if (isEnSDSExisted) {
          renameSDS('en', foundCAS.CASNo, CASNo)
        }

        const isBmSDSExisted = checkSDSExists('bm', foundCAS.CASNo)
        if (isBmSDSExisted) {
          renameSDS('bm', foundCAS.CASNo, CASNo)
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

exports.deleteSDS = async (req, res, next) => {
  const isAdmin = req.user.isAdmin || false
  if (!isAdmin) {
    return next(new ErrorResponse('Only admin can delete SDS.', 400))
  }

  const CASId = ObjectId(req.params.CASId)

  const foundCAS = await CAS.findById(CASId)
  if (!foundCAS) {
    return next(new ErrorResponse('SDS not found.', 404))
  }

  const chemicalCount = await Chemical.countDocuments({ CASId: foundCAS._id })
  if (chemicalCount > 0) {
    return next(
      new ErrorResponse(
        'Unable to delete, the SDS has chemical(s) associated.',
        400
      )
    )
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await CAS.deleteOne({ _id: foundCAS._id }, { session })

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'SDS deleted.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
