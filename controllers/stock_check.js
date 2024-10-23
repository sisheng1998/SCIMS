const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const StockCheck = require('../models/StockCheck')
const { startSession } = require('mongoose')
const fieldsToString = require('../utils/fieldsToString')
const logEvents = require('../middleware/logEvents')

exports.getActiveStockCheck = async (req, res, next) => {
  const { labId } = req.body

  if (!labId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  try {
    const fieldNames = fieldsToString({
      _id: 1,
      recordedChemicals: {
        chemicalId: 1,
        CASNo: 1,
        name: 1,
        location: 1,
        unit: 1,
        amountInDB: 1,
      },
      missingChemicals: {
        chemicalId: 1,
        CASNo: 1,
        name: 1,
        location: 1,
        unit: 1,
        amountInDB: 1,
      },
      kivChemicals: {
        chemicalId: 1,
        CASNo: 1,
        name: 1,
        location: 1,
        unit: 1,
        amountInDB: 1,
      },
      disposedChemicals: {
        chemicalId: 1,
      },
    })

    const activeStockCheck = await StockCheck.findOne(
      {
        lab: foundLab._id,
        status: 'In Progress',
      },
      fieldNames
    )

    if (!activeStockCheck) {
      return next(new ErrorResponse('No active stock check.', 404))
    }

    const chemicals = [
      ...activeStockCheck.recordedChemicals,
      ...activeStockCheck.missingChemicals,
      ...activeStockCheck.kivChemicals,
    ]

    res.status(200).json({
      success: true,
      reportId: activeStockCheck._id,
      chemicals,
      disposedChemicals: activeStockCheck.disposedChemicals,
    })
  } catch (error) {
    next(error)
  }
}

exports.startStockCheck = async (req, res, next) => {
  const { labId } = req.body

  if (!labId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundLab = await Lab.findById(
    labId,
    fieldsToString({
      _id: 1,
      chemicals: 1,
      disposedChemicals: 1,
      locations: {
        _id: 1,
        name: 1,
      },
    })
  ).populate({
    path: 'chemicals disposedChemicals',
    select: fieldsToString({
      _id: 1,
      CASId: 1,
      name: 1,
      locationId: 1,
      unit: 1,
      amount: 1,
      status: 1,
    }),
    populate: [
      {
        path: 'CASId',
        model: 'CAS',
        select: 'CASNo',
      },
    ],
  })
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const locations = foundLab.locations

    const missingChemicals = foundLab.chemicals
      .filter((chemical) => chemical.status !== 'Keep In View')
      .map((chemical) => ({
        chemicalId: chemical._id,
        CASNo: chemical.CASId.CASNo,
        name: chemical.name,
        location:
          locations.find((location) => location._id.equals(chemical.locationId))
            ?.name || '-',
        unit: chemical.unit,
        amountInDB: chemical.amount,
      }))

    const kivChemicals = foundLab.chemicals
      .filter((chemical) => chemical.status === 'Keep In View')
      .map((chemical) => ({
        chemicalId: chemical._id,
        CASNo: chemical.CASId.CASNo,
        name: chemical.name,
        location:
          locations.find((location) => location._id.equals(chemical.locationId))
            ?.name || '-',
        unit: chemical.unit,
        amountInDB: chemical.amount,
      }))

    const disposedChemicals = foundLab.disposedChemicals.map((chemical) => ({
      chemicalId: chemical._id,
      CASNo: chemical.CASId.CASNo,
      name: chemical.name,
      location:
        locations.find((location) => location._id.equals(chemical.locationId))
          ?.name || '-',
      unit: chemical.unit,
      amountInDB: chemical.amount,
    }))

    await StockCheck.create(
      [
        {
          lab: foundLab._id,
          recordedChemicals: [],
          missingChemicals,
          kivChemicals,
          disposedChemicals,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Stock check process started.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.stockCheck = async (req, res, next) => {
  const { reportId, chemicals } = req.body

  if (!reportId || !chemicals) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const stockCheck = await StockCheck.findById(reportId)
  if (!stockCheck) {
    return next(new ErrorResponse('Report not found.', 404))
  }

  if (stockCheck.status !== 'In Progress') {
    return res.status(200).json({
      success: true,
      data: 'Nothing will be updated.',
    })
  }

  const session = await startSession()

  try {
    session.startTransaction()

    for (let chemical of chemicals) {
      const indexInMissing = stockCheck.missingChemicals.findIndex(
        (missingChemical) =>
          missingChemical.chemicalId.toString() === chemical.chemicalId
      )

      const indexInKiv = stockCheck.kivChemicals.findIndex(
        (kivChemical) =>
          kivChemical.chemicalId.toString() === chemical.chemicalId
      )

      const indexInRecorded = stockCheck.recordedChemicals.findIndex(
        (recordedChemical) =>
          recordedChemical.chemicalId.toString() === chemical.chemicalId
      )

      if (indexInMissing !== -1) {
        const missingChemical = {
          ...stockCheck.missingChemicals[indexInMissing].toObject(),
        }

        missingChemical.amount = chemical.amount
        missingChemical.recordedAt = new Date()
        missingChemical.recordedBy = req.user._id

        stockCheck.recordedChemicals.push(missingChemical)
        stockCheck.missingChemicals.splice(indexInMissing, 1)
      } else if (indexInKiv !== -1) {
        const kivChemical = {
          ...stockCheck.kivChemicals[indexInKiv].toObject(),
        }

        kivChemical.amount = chemical.amount
        kivChemical.recordedAt = new Date()
        kivChemical.recordedBy = req.user._id

        stockCheck.recordedChemicals.push(kivChemical)
        stockCheck.kivChemicals.splice(indexInKiv, 1)
      } else if (indexInRecorded !== -1) {
        stockCheck.recordedChemicals[indexInRecorded].amount = chemical.amount
        stockCheck.recordedChemicals[indexInRecorded].recordedAt = new Date()
        stockCheck.recordedChemicals[indexInRecorded].recordedBy = req.user._id
      }
    }

    await stockCheck.save({ session })
    await session.commitTransaction()
    session.endSession()

    try {
      logEvents(
        `"${req.user.name}" saved ${
          chemicals.length
        } record(s) for Stock Check "${stockCheck._id}":\n${JSON.stringify(
          chemicals,
          null,
          2
        )}`,
        'stockCheckLogs.txt'
      )
    } catch (error) {
      logEvents(
        `Error logging stock check: ${error.message}`,
        'stockCheckLogs.txt'
      )
    }

    res.status(200).json({
      success: true,
      data: 'Records saved.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.endStockCheck = async (req, res, next) => {
  const { labId, reportId } = req.body

  if (!labId || !reportId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await StockCheck.updateOne(
      { _id: reportId, lab: foundLab._id },
      {
        $set: {
          status: 'Completed',
        },
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Stock check process completed.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.reopenStockCheck = async (req, res, next) => {
  const { labId, reportId } = req.body

  if (!labId || !reportId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await StockCheck.updateMany(
      {
        lab: foundLab._id,
        status: 'In Progress',
        _id: { $ne: reportId },
      },
      {
        $set: {
          status: 'Completed',
        },
      },
      { session }
    )

    await StockCheck.updateOne(
      { _id: reportId, lab: foundLab._id },
      {
        $set: {
          status: 'In Progress',
        },
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Stock check process reopened.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}
