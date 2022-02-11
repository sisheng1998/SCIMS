import React from 'react'
import {
	Navigate,
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'

// Routing
import PrivateRoute from './components/routes/PrivateRoute'

// Auth
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import EmailVerification from './components/auth/EmailVerification'
import SendEmailVerification from './components/auth/SendEmailVerification'

// Application
import Dashboard from './components/app/Dashboard'

// Layouts
import AuthLayout from './components/layouts/AuthLayout'

const App = () => {
	return (
		<Router>
			<>
				<Routes>
					{/* Private route */}
					<Route exact path='/' element={<PrivateRoute />}>
						<Route exact path='/' element={<Dashboard />} />
					</Route>

					{/* Public route */}
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
					</Route>

					{/* Redirect all to login page */}
					<Route path='*' element={<Navigate to='/login' />} />
				</Routes>
			</>
		</Router>
	)
}

export default App
