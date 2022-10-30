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
  ClipboardCheckIcon,
  UserIcon,
  ColorSwatchIcon,
  BellIcon,
  ClipboardListIcon,
  DocumentTextIcon,
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
    text: 'Safety Data Sheets',
    link: '/sds',
    icon: <DocumentTextIcon />,
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
    text: 'Activity Logs',
    link: '/activity-logs',
    icon: <ClipboardListIcon />,
    minRole: ROLES_LIST.labOwner,
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
  // {
  //   text: 'Inventory',
  //   link: '/admin/inventory',
  //   icon: <CubeIcon />,
  //   minRole: ROLES_LIST.admin,
  // },
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
    link: '/',
    icon: <HomeIcon />,
    minRole: ROLES_LIST.guest,
  },
  {
    text: 'Inventory',
    link: '/inventory',
    icon: <CubeIcon />,
    minRole: ROLES_LIST.guest,
  },
  {
    text: 'SDS Docs',
    link: '/sds',
    icon: <DocumentTextIcon />,
    minRole: ROLES_LIST.guest,
  },
  {
    text: 'Stock Check',
    link: '/stock-check',
    icon: <ClipboardCheckIcon />,
    minRole: ROLES_LIST.labOwner,
  },
  {
    text: 'Profile',
    link: '/profile',
    icon: <UserIcon />,
    minRole: ROLES_LIST.guest,
  },
  {
    text: 'My Labs',
    link: '/labs',
    icon: <ColorSwatchIcon />,
    minRole: ROLES_LIST.guest,
  },
  {
    text: 'Notifications',
    link: '/notifications',
    icon: <BellIcon />,
    minRole: ROLES_LIST.guest,
  },
]

export { ADMIN_MENU_LIST, MOBILE_MENU_LIST }
