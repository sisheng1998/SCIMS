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
	},
	{
		text: 'Inventory',
		link: '/inventory',
		icon: <CubeIcon />,
	},
	{
		text: 'Reports',
		link: '/reports',
		icon: <ChartBarIcon />,
	},
	{
		text: 'Stock Check',
		link: '/stock-check',
		icon: <ClipboardCheckIcon />,
	},
	{
		text: 'Import / Export',
		link: '/import-export',
		icon: <SwitchVerticalIcon />,
	},
	{
		text: 'Users',
		link: '/users',
		icon: <UsersIcon />,
	},
	{
		text: 'Labs',
		link: '/labs',
		icon: <BeakerIcon />,
	},
	{
		text: 'Settings',
		link: '/settings',
		icon: <CogIcon />,
	},
]

export default MENU_LIST
