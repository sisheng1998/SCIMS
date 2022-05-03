import ROLES_LIST from './roles_list'
import {
	ViewGridIcon,
	CubeIcon,
	ChartBarIcon,
	SwitchVerticalIcon,
	UsersIcon,
	BeakerIcon,
	CogIcon,
	HomeIcon,
	QrcodeIcon,
	ClipboardCheckIcon,
	UserIcon,
	ColorSwatchIcon,
	BellIcon,
} from '@heroicons/react/outline'

const MENU_LIST = [
	{
		text: 'Dashboard',
		link: '/',
		icon: <ViewGridIcon />,
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'Inventory',
		link: '/inventory',
		icon: <CubeIcon />,
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'Reports',
		link: '/reports',
		icon: <ChartBarIcon />,
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
		minRole: ROLES_LIST.guest,
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

const MOBILE_MENU_LIST = [
	{
		text: 'Home',
		icon: <HomeIcon />,
		link: '/',
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'Inventory',
		icon: <CubeIcon />,
		link: '/inventory',
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'Scan',
		icon: <QrcodeIcon />,
		link: '-',
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'Stock Check',
		icon: <ClipboardCheckIcon />,
		link: '/stock-check',
		minRole: ROLES_LIST.labOwner,
	},
	{
		text: 'Profile',
		icon: <UserIcon />,
		link: '/profile',
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'My Labs',
		icon: <ColorSwatchIcon />,
		link: '/labs',
		minRole: ROLES_LIST.guest,
	},
	{
		text: 'Notifications',
		icon: <BellIcon />,
		link: '/notifications',
		minRole: ROLES_LIST.guest,
	},
]

export { ADMIN_MENU_LIST, MOBILE_MENU_LIST }
