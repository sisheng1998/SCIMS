import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import ROLES_LIST from './config/roles_list'

// Routing
import PublicRoute from './components/routes/PublicRoute'
import PrivateRoute from './components/routes/PrivateRoute'
import Authorization from './components/routes/Authorization'

// Auth
import RemainLogin from './components/auth/RemainLogin'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import EmailVerification from './components/auth/EmailVerification'
import SendEmailVerification from './components/auth/SendEmailVerification'

// Application
import Dashboard from './components/app/dashboard/Dashboard'
import Inventory from './components/app/inventory/Inventory'
import Reports from './components/app/reports/Reports'
import StockCheck from './components/app/stock-check/StockCheck'
import ImportExport from './components/app/import-export/ImportExport'
import Users from './components/app/users/Users'
import Labs from './components/app/labs/Labs'
import Settings from './components/app/settings/Settings'
import Notification from './components/app/notification/Notification'
import Profile from './components/app/profile/Profile'
import PendingApproval from './components/app/PendingApproval'
import ApplyNewLab from './components/app/ApplyNewLab'

// Admin
import AdminDashboard from './components/app/admin/dashboard/Dashboard'
import AdminLabs from './components/app/admin/labs/Labs'
import AdminUsers from './components/app/admin/users/Users'
import AdminSettings from './components/app/admin/settings/Settings'

// Layouts
import AuthLayout from './components/layouts/AuthLayout'
import AppLayout from './components/layouts/AppLayout'

const App = () => {
	return (
		<Routes>
			<Route element={<RemainLogin />}>
				{/* Private route */}
				<Route element={<PrivateRoute />}>
					<Route element={<AppLayout />}>
						{/* Accessible by all roles */}
						<Route exact path='/' element={<Dashboard />} />
						<Route exact path='/inventory' element={<Inventory />} />
						<Route exact path='/users' element={<Users />} />
						<Route exact path='/labs' element={<Labs />} />
						<Route exact path='/notification' element={<Notification />} />
						<Route exact path='/profile' element={<Profile />} />

						{/* Accessible by lab owner or admin only */}
						<Route element={<Authorization minRole={ROLES_LIST.labOwner} />}>
							<Route exact path='/reports' element={<Reports />} />
							<Route exact path='/stock-check' element={<StockCheck />} />
							<Route exact path='/import-export' element={<ImportExport />} />
							<Route exact path='/settings' element={<Settings />} />
						</Route>

						{/* Accessible by admin only */}
						<Route element={<Authorization minRole={ROLES_LIST.admin} />}>
							<Route exact path='/admin' element={<AdminDashboard />} />
							<Route exact path='/admin/labs' element={<AdminLabs />} />
							<Route exact path='/admin/users' element={<AdminUsers />} />
							<Route exact path='/admin/settings' element={<AdminSettings />} />
						</Route>
					</Route>

					<Route element={<AuthLayout />}>
						{/* Haven't approved by lab owner */}
						<Route
							exact
							path='/pending-approval'
							element={<PendingApproval />}
						/>
						{/* Apply for other lab */}
						<Route exact path='/apply-new-lab' element={<ApplyNewLab />} />
					</Route>
				</Route>

				{/* Public route */}
				<Route element={<PublicRoute />}>
					<Route element={<AuthLayout />}>
						<Route exact path='/login' element={<Login />} />
						<Route exact path='/register' element={<Register />} />
						<Route exact path='/forgot-password' element={<ForgotPassword />} />
						<Route
							exact
							path='/reset-password/:resetToken'
							element={<ResetPassword />}
						/>
						<Route
							exact
							path='/verify-email/:emailVerificationToken'
							element={<EmailVerification />}
						/>
						<Route
							exact
							path='/verify-email'
							element={<SendEmailVerification />}
						/>

						{/* Redirect all to login page */}
						<Route path='*' element={<Navigate to='/login' />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	)
}

export default App
