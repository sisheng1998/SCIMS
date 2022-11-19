const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')
const Chemical = require('../models/Chemical')
const CAS = require('../models/CAS')
const Usage = require('../models/Usage')
const Activity = require('../models/Activity')
const User = require('../models/User')
const Subscriber = require('../models/Subscriber')
const Config = require('../models/Config')
const Notification = require('../models/Notification')
const ROLES_LIST = require('../config/roles_list')
const { startSession } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const generateQRCode = require('../utils/generateQRCode')
const COCLists = require('../chemical_data/coc.json')
const GHSLists = require('../chemical_data/ghs.json')
const pictograms = require('../chemical_data/pictograms.json')
const sendEmail = require('../utils/sendEmail')
const sendNotification = require('../utils/sendNotification')

const getKeysByValue = (object, value) =>
  Object.keys(object).filter((key) => object[key] === value)

const labOption =
  'labName labOwner labUsers chemicals locations createdAt lastUpdated'
const chemicalOption =
  'QRCode CASId name unit containerSize minAmount amount lab expirationDate disposedDate locationId storageClass status createdAt lastUpdated'
const UserInfo =
  'name email altEmail avatar matricNo isEmailVerified createdAt lastUpdated roles.lab roles.role roles.status isAdmin'

exports.getChemicals = async (req, res, next) => {
  const labId = req.body.labId

  let data = {
    foundLabs: [],
    chemicals: [],
    disposedChemicals: [],
    admins: 0,
  }

  try {
    const admins = await User.countDocuments({
      isAdmin: true,
    })

    if (labId === 'All Labs') {
      const labs = req.user.roles
        .filter((role) => role.status === 'Active')
        .map((role) => role.lab)

      const foundLabs = req.user.isAdmin
        ? await Lab.find(
            {
              status: 'In Use',
            },
            'labName locations'
          )
        : await Lab.find(
            {
              _id: {
                $in: labs,
              },
              status: 'In Use',
            },
            'labName locations'
          )

      if (foundLabs.length === 0) {
        return next(new ErrorResponse('Lab not found.', 404))
      }

      const chemicals = await Chemical.find(
        {
          lab: {
            $in: foundLabs,
          },
          status: {
            $ne: 'Disposed',
          },
        },
        'CASId QRCode amount minAmount containerSize expirationDate locationId lab name status unit lastUpdated'
      )
        .populate('CASId', '-_id')
        .populate('lab', 'labName')
        .sort({ createdAt: -1 })

      const disposedChemicals = await Chemical.find(
        {
          lab: {
            $in: foundLabs,
          },
          status: 'Disposed',
        },
        'CASId QRCode amount minAmount expirationDate disposedDate locationId lab name status unit'
      )
        .populate('CASId', '-_id')
        .populate('lab', 'labName')
        .sort({ disposedDate: -1 })

      data = {
        labs: foundLabs,
        chemicals,
        disposedChemicals,
        admins,
      }
    } else {
      const foundLab = await Lab.findById(labId, labOption)
        .populate({
          path: 'chemicals disposedChemicals',
          select: chemicalOption,
          populate: [
            {
              path: 'CASId',
              model: 'CAS',
            },
            {
              path: 'lab',
              select: 'labName _id',
            },
          ],
        })
        .populate({
          path: 'labOwner',
          match: {
            $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
          },
          select: UserInfo,
        })
        .populate({
          path: 'labUsers',
          match: {
            $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }],
          },
          select: UserInfo,
        })

      if (!foundLab) {
        return next(new ErrorResponse('Lab not found.', 404))
      }

      data = { ...foundLab._doc, admins }
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    return next(new ErrorResponse('Lab not found.', 404))
  }
}

exports.addChemical = async (req, res, next) => {
  const {
    CASNo,
    name,
    state,
    unit,
    containerSize,
    amount,
    minAmount,
    labId,
    locationId,
    storageClass,
    dateIn,
    dateOpen,
    expirationDate,
    classifications,
    COCs,
    supplier,
    brand,
    notes,
  } = JSON.parse(req.body.chemicalInfo)

  if (
    !CASNo ||
    !name ||
    !state ||
    !unit ||
    !containerSize ||
    !amount ||
    !minAmount ||
    !labId ||
    !locationId ||
    !dateIn ||
    !expirationDate
  ) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const foundLocation = foundLab.locations.filter((location) =>
    location._id.equals(locationId)
  )

  if (foundLocation.length === 0) {
    return next(new ErrorResponse('Location not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    let status = 'Normal'
    if (Number(amount) <= Number(minAmount)) {
      status = 'Low Amount'
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (new Date(expirationDate) < today) {
      status = 'Expired'
    } else {
      const config = await Config.findOne({}, '-_id')

      const future = new Date(
        today.setDate(today.getDate() + config.DAY_BEFORE_EXP)
      )

      if (new Date(expirationDate) < future) {
        status = 'Expiring Soon'
      }
    }

    const chemicalData = {
      name,
      state,
      unit,
      containerSize: Number(containerSize).toFixed(2),
      amount: Number(amount).toFixed(2),
      minAmount: Number(minAmount).toFixed(2),
      lab: foundLab._id,
      locationId: foundLocation[0]._id,
      storageClass,
      status,
      dateIn,
      expirationDate,
      supplier,
      brand,
      notes,
    }

    const foundCAS = await CAS.findOne({ CASNo })
    if (!foundCAS) {
      const newCAS = await CAS.create(
        [
          {
            CASNo,
            chemicalName: name,
            SDS: req.file.filename,
            classifications,
            COCs,
          },
        ],
        { session }
      )

      chemicalData.CASId = newCAS[0]._id
    } else {
      chemicalData.CASId = foundCAS._id
    }

    if (dateOpen !== '') {
      chemicalData.dateOpen = dateOpen
    }

    const chemical = await Chemical.create([chemicalData], { session })

    const QRCode = await generateQRCode(chemical[0]._id)

    await Chemical.updateOne(
      { _id: chemical[0]._id },
      {
        $set: {
          QRCode,
        },
      },
      { new: true, session }
    )

    await Lab.updateOne(
      { _id: foundLab._id },
      {
        $push: {
          chemicals: chemical[0]._id,
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Activity.create(
      [
        {
          lab: foundLab._id,
          user: req.user._id,
          chemical: chemical[0]._id,
          description: 'New chemical added.',
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'New chemical added.',
      chemicalId: chemical[0]._id,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.updateChemical = async (req, res, next) => {
  const {
    _id,
    name,
    state,
    unit,
    containerSize,
    amount,
    minAmount,
    labId,
    locationId,
    storageClass,
    dateIn,
    dateOpen,
    expirationDate,
    supplier,
    brand,
    notes,
  } = req.body

  if (!_id || !labId || !locationId) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundChemical = await Chemical.findById(_id)
  if (!foundChemical) {
    return next(new ErrorResponse('Chemical not found.', 404))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const foundLocation = foundLab.locations.find((location) =>
    location._id.equals(locationId)
  )
  if (!foundLocation) {
    return next(new ErrorResponse('Location not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    let status = 'Normal'
    if (Number(amount) <= Number(minAmount)) {
      status = 'Low Amount'
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (new Date(expirationDate) < today) {
      status = 'Expired'
    } else {
      const config = await Config.findOne({}, '-_id')

      const future = new Date(
        today.setDate(today.getDate() + config.DAY_BEFORE_EXP)
      )

      if (new Date(expirationDate) < future) {
        status = 'Expiring Soon'
      }
    }

    const updateQuery = {}
    const removeQuery = {}
    let changes = ''
    let isUnitChanged = false

    if (status && status !== foundChemical.status) {
      updateQuery.status = status
    }

    if (name && name !== foundChemical.name) {
      updateQuery.name = name
      changes += `Name:\n${foundChemical.name} → ${name}\n\n`
    }

    if (state && state !== foundChemical.state) {
      updateQuery.state = state
      changes += `State:\n${foundChemical.state} → ${state}\n\n`
    }

    if (unit && unit !== foundChemical.unit) {
      updateQuery.unit = unit
      changes += `Unit:\n${foundChemical.unit} → ${unit}\n\n`
      isUnitChanged = true
    }

    if (
      containerSize &&
      Number(containerSize).toFixed(2) !==
        Number(foundChemical.containerSize).toFixed(2)
    ) {
      updateQuery.containerSize = Number(containerSize).toFixed(2)
      changes += `Container Size:\n${foundChemical.containerSize} ${
        foundChemical.unit
      } → ${containerSize} ${
        isUnitChanged ? updateQuery.unit : foundChemical.unit
      }\n\n`
    }

    if (
      amount &&
      Number(amount).toFixed(2) !== Number(foundChemical.amount).toFixed(2)
    ) {
      updateQuery.amount = Number(amount).toFixed(2)
      changes += `Amount:\n${foundChemical.amount} ${
        foundChemical.unit
      } → ${amount} ${
        isUnitChanged ? updateQuery.unit : foundChemical.unit
      }\n\n`
    }

    if (
      minAmount &&
      Number(minAmount).toFixed(2) !==
        Number(foundChemical.minAmount).toFixed(2)
    ) {
      updateQuery.minAmount = Number(minAmount).toFixed(2)
      changes += `Minimum Amount:\n${foundChemical.minAmount} ${
        foundChemical.unit
      } → ${minAmount} ${
        isUnitChanged ? updateQuery.unit : foundChemical.unit
      }\n\n`
    }

    if (labId && !foundChemical.lab.equals(labId)) {
      updateQuery.lab = foundLab._id
    }

    if (locationId && foundChemical.locationId !== locationId) {
      updateQuery.locationId = foundLocation._id

      const oldLocation = foundLab.locations.find((location) =>
        location._id.equals(foundChemical.locationId)
      )

      changes += `Location:\n${oldLocation ? oldLocation.name : '-'} → ${
        foundLocation.name
      }\n\n`
    }

    if (storageClass !== foundChemical.storageClass) {
      updateQuery.storageClass = storageClass
      changes += `Storage Class:\n${
        foundChemical.storageClass ? 'Class ' + foundChemical.storageClass : '-'
      } → ${storageClass ? 'Class ' + storageClass : '-'}\n\n`
    }

    if (
      dateIn &&
      new Date(dateIn).toLocaleDateString('en-CA') !==
        new Date(foundChemical.dateIn).toLocaleDateString('en-CA')
    ) {
      updateQuery.dateIn = dateIn
      changes += `Date In:\n${new Date(foundChemical.dateIn).toLocaleDateString(
        'en-CA'
      )} → ${dateIn}\n\n`
    }

    if (dateOpen === '' && foundChemical.dateOpen) {
      removeQuery.dateOpen = ''
      changes += `Date Open:\n${new Date(
        foundChemical.dateOpen
      ).toLocaleDateString('en-CA')} → -\n\n`
    } else if (
      dateOpen &&
      new Date(dateOpen).toLocaleDateString('en-CA') !==
        new Date(foundChemical.dateOpen).toLocaleDateString('en-CA')
    ) {
      updateQuery.dateOpen = dateOpen
      changes += `Date Open:\n${
        foundChemical.dateOpen
          ? new Date(foundChemical.dateOpen).toLocaleDateString('en-CA')
          : '-'
      } → ${dateOpen}\n\n`
    }

    if (
      expirationDate &&
      new Date(expirationDate).toLocaleDateString('en-CA') !==
        new Date(foundChemical.expirationDate).toLocaleDateString('en-CA')
    ) {
      updateQuery.expirationDate = expirationDate
      changes += `Expiration Date:\n${new Date(
        foundChemical.expirationDate
      ).toLocaleDateString('en-CA')} → ${expirationDate}\n\n`
    }

    if (supplier !== foundChemical.supplier) {
      updateQuery.supplier = supplier
      changes += `Supplier:\n${
        foundChemical.supplier ? foundChemical.supplier : '-'
      } → ${supplier ? supplier : '-'}\n\n`
    }

    if (brand !== foundChemical.brand) {
      updateQuery.brand = brand
      changes += `Brand:\n${
        foundChemical.brand ? foundChemical.brand : '-'
      } → ${brand ? brand : '-'}\n\n`
    }

    if (notes !== foundChemical.notes) {
      updateQuery.notes = notes
      changes += `Notes:\n${
        foundChemical.notes ? foundChemical.notes : '-'
      }\n↓\n${notes ? notes : '-'}\n\n`
    }

    if (changes !== '') {
      updateQuery.lastUpdated = Date.now()

      await Chemical.updateOne(
        { _id: foundChemical._id },
        {
          $set: updateQuery,
          $unset: removeQuery,
        },
        { new: true, session }
      )

      await Activity.create(
        [
          {
            lab: foundLab._id,
            user: req.user._id,
            chemical: foundChemical._id,
            description: 'Chemical info updated.',
            changes,
          },
        ],
        { session }
      )
    }

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'Chemical updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.getChemicalInfo = async (req, res, next) => {
  const chemicalId = ObjectId(req.params.chemicalId)

  try {
    const foundChemical = await Chemical.findOne({
      _id: chemicalId,
    })
      .populate('CASId')
      .populate({
        path: 'lab',
        select: 'labOwner labName locations',
        populate: {
          path: 'labOwner',
          select: 'name',
        },
      })

    if (!foundChemical) {
      return next(new ErrorResponse('Chemical not found.', 404))
    }

    res.status(201).json({
      success: true,
      data: foundChemical,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateAmount = async (req, res, next) => {
  const { chemicalId, usage, remark } = req.body

  if (!chemicalId || !usage) {
    return next(new ErrorResponse('Missing value for required field.', 400))
  }

  const foundChemical = await Chemical.findById(chemicalId).populate(
    'lab',
    'labName'
  )
  if (!foundChemical) {
    return next(new ErrorResponse('Chemical not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    let isNegative = false

    const updateQuery = {
      lastUpdated: Date.now(),
    }

    const amount = Number(Number(foundChemical.amount) - Number(usage)).toFixed(
      2
    )

    if (Number(amount) < 0) {
      updateQuery.amount = 0
      isNegative = true
    } else {
      updateQuery.amount = amount
    }

    if (
      (foundChemical.status === 'Normal' ||
        foundChemical.status === 'Expiring Soon') &&
      Number(amount) <= foundChemical.minAmount
    ) {
      if (foundChemical.status !== 'Expiring Soon') {
        updateQuery.status = 'Low Amount'
      }

      const users = await User.find(
        {
          roles: {
            $elemMatch: {
              lab: { $eq: foundChemical.lab._id },
              role: { $gte: ROLES_LIST.postgraduate },
              status: { $eq: 'Active' },
            },
          },
        },
        'email'
      ).session(session)

      users.forEach(async (user) => {
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              notification: true,
            },
          },
          { new: true, session }
        )

        sendEmail({
          to: user.email,
          subject: 'Alert - Chemical Low Amount',
          template: 'low_amount',
          context: {
            lab: foundChemical.lab.labName,
            chemicalName: foundChemical.name,
            url: `${process.env.DOMAIN_NAME}/inventory/${foundChemical._id}`,
          },
        })
      })

      await Notification.create(
        [
          {
            lab: foundChemical.lab._id,
            users: users.map((user) => user._id),
            chemical: foundChemical._id,
            type: 'Low Amount',
          },
        ],
        { session }
      )

      const subscribers = await Subscriber.find(
        { user: { $in: users } },
        'endpoint keys'
      ).session(session)

      subscribers.forEach((subscriber) => {
        const subscription = {
          endpoint: subscriber.endpoint,
          keys: subscriber.keys,
        }
        const payload = JSON.stringify({
          title: 'Alert - Chemical Reached Low Amount',
          message: `[Lab ${foundChemical.lab.labName}] ${foundChemical.name} has reached low amount.`,
          url: '/notifications',
        })

        sendNotification(subscription, payload)
      })
    }

    if (!foundChemical.dateOpen) {
      updateQuery.dateOpen = Date.now()
    }

    await Usage.create(
      [
        {
          lab: foundChemical.lab._id,
          user: req.user._id,
          chemical: foundChemical._id,
          originalAmount: foundChemical.amount,
          usage: isNegative ? foundChemical.amount : Number(usage).toFixed(2),
          unit: foundChemical.unit,
          remark,
        },
      ],
      { session }
    )

    await Chemical.updateOne(
      { _id: foundChemical._id },
      {
        $set: updateQuery,
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      data: 'Chemical amount updated.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.disposeChemical = async (req, res, next) => {
  const { chemicalId, labId } = req.body

  if (!chemicalId || !labId) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const foundChemical = await Chemical.findById(chemicalId)
  if (!foundChemical) {
    return next(new ErrorResponse('Chemical not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    await Lab.updateOne(
      { _id: foundLab._id },
      {
        $pull: {
          chemicals: chemicalId,
        },
        $push: {
          disposedChemicals: chemicalId,
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Chemical.updateOne(
      { _id: foundChemical._id },
      {
        $set: {
          status: 'Disposed',
          disposedDate: Date.now(),
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Activity.create(
      [
        {
          lab: foundLab._id,
          user: req.user._id,
          chemical: foundChemical._id,
          description: 'Chemical disposed.',
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Chemical disposed.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.cancelDisposal = async (req, res, next) => {
  const { chemicalId, labId } = req.body

  if (!chemicalId || !labId) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  const foundLab = await Lab.findById(labId)
  if (!foundLab) {
    return next(new ErrorResponse('Lab not found.', 404))
  }

  const foundChemical = await Chemical.findById(chemicalId)
  if (!foundChemical) {
    return next(new ErrorResponse('Chemical not found.', 404))
  }

  const session = await startSession()

  try {
    session.startTransaction()

    let status = 'Normal'
    if (Number(foundChemical.amount) <= Number(foundChemical.minAmount)) {
      status = 'Low Amount'
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (new Date(foundChemical.expirationDate) < today) {
      status = 'Expired'
    } else {
      const config = await Config.findOne({}, '-_id')

      const future = new Date(
        today.setDate(today.getDate() + config.DAY_BEFORE_EXP)
      )

      if (new Date(foundChemical.expirationDate) < future) {
        status = 'Expiring Soon'
      }
    }

    await Lab.updateOne(
      { _id: foundLab._id },
      {
        $pull: {
          disposedChemicals: chemicalId,
        },
        $push: {
          chemicals: chemicalId,
        },
        $set: {
          lastUpdated: Date.now(),
        },
      },
      { new: true, session }
    )

    await Chemical.updateOne(
      { _id: foundChemical._id },
      {
        $set: {
          status,
          lastUpdated: Date.now(),
        },
        $unset: {
          disposedDate: '',
        },
      },
      { new: true, session }
    )

    await Activity.create(
      [
        {
          lab: foundLab._id,
          user: req.user._id,
          chemical: foundChemical._id,
          description: 'Chemical disposal cancelled.',
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      data: 'Chemical disposal cancelled.',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}

exports.getCASInfo = async (req, res, next) => {
  const { CASNo } = req.body
  if (!CASNo) {
    return next(new ErrorResponse('Missing required value.', 400))
  }

  try {
    const foundCAS = await CAS.findOne({ CASNo })

    if (!foundCAS) {
      let CASInfo = { SDS: '', classifications: [], COCs: [] }

      const foundGHSs = GHSLists.find((list) => list.CASNumber.includes(CASNo))

      if (foundGHSs && foundGHSs.pictograms.includes(',')) {
        const GHSs = foundGHSs.pictograms.split(',')

        CASInfo.classifications = GHSs.filter((GHS) =>
          GHS.toLowerCase().includes('ghs')
        ).map((GHS) => pictograms[GHS])
      }

      const foundCOCs = COCLists.find((list) => list.CASNumber === CASNo)

      if (foundCOCs) {
        CASInfo.COCs = getKeysByValue(foundCOCs, 1)
      }

      res.status(200).json({
        success: true,
        data: CASInfo,
      })
    } else {
      res.status(200).json({
        success: true,
        data: foundCAS,
      })
    }
  } catch (error) {
    return next(error)
  }
}
