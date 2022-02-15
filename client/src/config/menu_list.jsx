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
		text: 'Labs',
		link: '/labs',
		icon: <BeakerIcon />,
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
