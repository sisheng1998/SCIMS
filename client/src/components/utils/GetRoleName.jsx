import ROLES_LIST from '../../config/roles_list'

const GetRoleName = (value) => {
	const roleName = Object.keys(ROLES_LIST).find(
		(key) => ROLES_LIST[key] === value
	)

	if (roleName === 'labOwner') {
		return 'Lab Owner'
	}

	return roleName
}

export default GetRoleName
