import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'

// Routing
import PublicRoute from './components/routes/PublicRoute'
import PrivateRoute from './components/routes/PrivateRoute'

// Auth
import RemainLogin from './components/auth/RemainLogin'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import EmailVerification from './components/auth/EmailVerification'
import SendEmailVerification from './components/auth/SendEmailVerification'

// Application
import Dashboard from './components/app/Dashboard'
import PendingApproval from './components/app/PendingApproval'

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
						<Route exact path='/' element={<Dashboard />} />
					</Route>

					<Route element={<AuthLayout />}>
						{/* Haven't approved by lab owner */}
						<Route
							exact
							path='/pending-approval'
							element={<PendingApproval />}
						/>
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
