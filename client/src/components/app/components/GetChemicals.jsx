const GetChemicals = async (axiosPrivate, labId) => {
	try {
		const { data } = await axiosPrivate.post('/api/private/chemicals', {
			labId,
		})
		return data.data.chemicals
	} catch (error) {
		return []
	}
}

export default GetChemicals
