import ROLES_LIST from './roles_list'
import {
	ViewGridIcon,
	CubeIcon,
	ChartBarIcon,
	ClipboardCheckIcon,
	SwitchVerticalIcon,
	UsersIcon,
	BeakerIcon,
	CogIcon,
} from '@heroicons/react/outline'

const MENU_LIST = [
	{
		text: 'Dashboard',
		link: '/',
		icon: <ViewGridIcon />,
		minRole: ROLES_LIST.viewer,
	},
	{
		text: 'Inventory',
		link: '/inventory',
		icon: <CubeIcon />,
		minRole: ROLES_LIST.viewer,
	},
	{
		text: 'Reports',
		link: '/reports',
		icon: <ChartBarIcon />,
		minRole: ROLES_LIST.labOwner,
	},
	{
		text: 'Stock Check',
		link: '/stock-check',
		icon: <ClipboardCheckIcon />,
		minRole: ROLES_LIST.labOwner,
	},
	{
		text: 'Import / Export',
		link: '/import-export',
		icon: <SwitchVerticalIcon />,
		minRole: ROLES_LIST.labOwner,
	},
	{
		text: 'Users',
		link: '/users',
		icon: <UsersIcon />,
		minRole: ROLES_LIST.viewer,
	},
	{
		text: 'Settings',
		link: '/settings',
		icon: <CogIcon />,
		minRole: ROLES_LIST.labOwner,
	},
]

export default MENU_LIST

const ADMIN_MENU_LIST = [
	{
		text: 'Dashboard',
		link: '/admin',
		icon: <ViewGridIcon />,
		minRole: ROLES_LIST.admin,
	},
	{
		text: 'Labs',
		link: '/admin/labs',
		icon: <BeakerIcon />,
		minRole: ROLES_LIST.admin,
	},
	{
		text: 'Users',
		link: '/admin/users',
		icon: <UsersIcon />,
		minRole: ROLES_LIST.admin,
	},
	{
		text: 'Settings',
		link: '/admin/settings',
		icon: <CogIcon />,
		minRole: ROLES_LIST.admin,
	},
]

export { ADMIN_MENU_LIST }
