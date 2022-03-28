const ConvertUnit = (value, from, to) => {
	const KG_L = ['kg', 'L']
	const G_ML = ['g', 'mL']
	const MG = ['mg']

	let convertedValue

	if (
		(KG_L.includes(from) && G_ML.includes(to)) ||
		(G_ML.includes(from) && MG.includes(to))
	) {
		convertedValue = Number(value) * 1000
	} else if (
		(G_ML.includes(from) && KG_L.includes(to)) ||
		(MG.includes(from) && G_ML.includes(to))
	) {
		convertedValue = Number(value) / 1000
	} else if (KG_L.includes(from) && MG.includes(to)) {
		convertedValue = Number(value) * 1000000
	} else if (MG.includes(from) && KG_L.includes(to)) {
		convertedValue = Number(value) / 1000000
	} else {
		convertedValue = value
	}

	return convertedValue
}

export default ConvertUnit
