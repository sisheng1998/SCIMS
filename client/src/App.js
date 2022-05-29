import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import ROLES_LIST from './config/roles_list'
import useMobile from './hooks/useMobile'
import useNetwork from './hooks/useNetwork'
import { RefreshIcon } from '@heroicons/react/outline'

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
import ChangeEmail from './components/auth/ChangeEmail'

// Application
import Dashboard from './components/app/dashboard/Dashboard'
import Inventory from './components/app/inventory/Inventory'
import Reports from './components/app/reports/Reports'
import StockCheck from './components/app/stock-check/StockCheck'
import ImportExport from './components/app/import-export/ImportExport'
import Users from './components/app/users/Users'
import Labs from './components/app/labs/Labs'
import Settings from './components/app/settings/Settings'
import ActivityLogs from './components/app/activity-logs/ActivityLogs'
import Notifications from './components/app/notifications/Notifications'
import Profile from './components/app/profile/Profile'
import PendingApproval from './components/app/PendingApproval'
import ProfileUpdate from './components/app/ProfileUpdate'
import ApplyNewLab from './components/app/ApplyNewLab'
import AddChemical from './components/app/inventory/AddChemical'
import ChemicalInfo from './components/app/inventory/ChemicalInfo'
import StockCheckReport from './components/app/reports/stock-check/StockCheckReport'
import SDS from './components/app/sds/SDS'

// Admin
import AdminDashboard from './components/app/admin/dashboard/Dashboard'
import AdminLabs from './components/app/admin/labs/Labs'
import AdminUsers from './components/app/admin/users/Users'
import AdminSettings from './components/app/admin/settings/Settings'

// Layouts
import AuthLayout from './components/layouts/AuthLayout'
import AppLayout from './components/layouts/AppLayout'

const App = () => {
	const isMobile = useMobile()
	const isOnline = useNetwork()

	return isOnline ? (
		<Routes>
			<Route element={<RemainLogin />}>
				{/* Private route */}
				<Route element={<PrivateRoute />}>
					<Route element={<AppLayout />}>
						{/* Accessible by all roles */}
						<Route exact path='/' element={<Dashboard />} />
						<Route exact path='/inventory' element={<Inventory />} />
						{!isMobile && <Route exact path='/users' element={<Users />} />}
						<Route exact path='/sds' element={<SDS />} />
						<Route exact path='/labs' element={<Labs />} />
						<Route exact path='/profile' element={<Profile />} />
						<Route exact path='/notifications' element={<Notifications />} />

						{/* Allow view only by Guest and Undergraduate, edit by postgraduate and above */}
						<Route
							exact
							path='/inventory/:chemicalId'
							element={<ChemicalInfo />}
						/>

						{/* Accessible by postgraduate or lab owner or admin only */}
						<Route
							element={<Authorization minRole={ROLES_LIST.postgraduate} />}
						>
							<Route
								exact
								path='/inventory/new-chemical'
								element={<AddChemical />}
							/>
						</Route>

						{/* Accessible by lab owner or admin only */}
						<Route element={<Authorization minRole={ROLES_LIST.labOwner} />}>
							{!isMobile ? (
								<>
									<Route exact path='/reports' element={<Reports />} />
									<Route
										exact
										path='/reports/:reportId'
										element={<StockCheckReport />}
									/>
									<Route
										exact
										path='/import-export'
										element={<ImportExport />}
									/>
									<Route
										exact
										path='/activity-logs'
										element={<ActivityLogs />}
									/>
									<Route exact path='/settings' element={<Settings />} />
								</>
							) : (
								<Route exact path='/stock-check' element={<StockCheck />} />
							)}
						</Route>

						{/* Accessible by admin only */}
						{!isMobile && (
							<Route element={<Authorization minRole={ROLES_LIST.admin} />}>
								<Route exact path='/admin' element={<AdminDashboard />} />
								<Route exact path='/admin/labs' element={<AdminLabs />} />
								<Route exact path='/admin/users' element={<AdminUsers />} />
								<Route
									exact
									path='/admin/settings'
									element={<AdminSettings />}
								/>
							</Route>
						)}
					</Route>

					<Route element={<AuthLayout />}>
						{/* Haven't complete profile */}
						<Route exact path='/profile-update' element={<ProfileUpdate />} />
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
						<Route exact path='/change-email' element={<ChangeEmail />} />

						{/* Redirect all to login page */}
						<Route path='*' element={<Navigate to='/login' />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	) : (
		<main className='flex min-h-screen flex-col items-center justify-center p-4'>
			<h1 className='font-semibold'>No Internet</h1>
			<p className='mb-4 mt-1 text-center'>Kindly connect to the Internet.</p>
			<button
				onClick={() => window.location.reload()}
				className='button button-outline'
			>
				<RefreshIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
				Refresh
			</button>
		</main>
	)
}

export default App
