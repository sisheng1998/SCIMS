const ErrorResponse = require('../utils/errorResponse')
const Lab = require('../models/Lab')

exports.addLocation = async (req, res, next) => {
	const { labId, name } = req.body

	if (!labId || !name) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const isLocationExisted = foundLab.locations.some(
			(location) => location.name.toLowerCase() === name.toLowerCase()
		)

		if (isLocationExisted) {
			return next(new ErrorResponse('Location existed.', 409))
		}

		await Lab.updateOne(foundLab, {
			$push: {
				locations: {
					name,
				},
			},
			$set: {
				lastUpdated: Date.now(),
			},
		})

		res.status(201).json({
			success: true,
			data: 'New location created.',
		})
	} catch (error) {
		next(error)
	}
}

exports.editLocation = async (req, res, next) => {
	const { labId, locationId, name, status } = req.body

	if (!labId || !locationId || !name || !status) {
		return next(new ErrorResponse('Missing value for required field.', 400))
	}

	try {
		const foundLab = await Lab.findById(labId)
		if (!foundLab) {
			return next(new ErrorResponse('Lab not found.', 404))
		}

		const isLocationExisted = foundLab.locations.some(
			(location) =>
				location.name.toLowerCase() === name.toLowerCase() &&
				!location._id.equals(locationId)
		)

		if (isLocationExisted) {
			return next(new ErrorResponse('Location existed.', 409))
		}

		await Lab.updateOne(
			foundLab,
			{
				$set: {
					'locations.$[el].name': name,
					'locations.$[el].status': status,
					lastUpdated: Date.now(),
				},
			},
			{ arrayFilters: [{ 'el._id': locationId }], new: true }
		)

		res.status(201).json({
			success: true,
			data: 'Location updated.',
		})
	} catch (error) {
		next(error)
	}
}

exports.removeLocation = async (req, res, next) => {
	const { labId, locationId } = req.body

	if (!labId || !locationId) {
		return next(new ErrorResponse('Missing required value.', 400))
	}

	try {
		await Lab.updateOne(
			{ _id: labId },
			{
				$pull: {
					locations: {
						_id: locationId,
					},
				},
				$set: {
					lastUpdated: Date.now(),
				},
			}
		)

		res.status(200).json({
			success: true,
			data: 'Location removed.',
		})
	} catch (error) {
		next(error)
	}
}
