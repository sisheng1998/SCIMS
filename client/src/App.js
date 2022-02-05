import React from 'react'
import {
	Navigate,
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'

// Routing
import PrivateRoute from './components/routing/PrivateRoute'

// Auth
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

// Application
import Dashboard from './components/app/Dashboard'

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
					<Route exact path='/login' element={<Login />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/forgot-password' element={<ForgotPassword />} />
					<Route
						exact
						path='/reset-password/:resetToken'
						element={<ResetPassword />}
					/>

					{/* Redirect all to login page */}
					<Route path='*' element={<Navigate to='/login' />} />
				</Routes>
			</>
		</Router>
	)
}

export default App
