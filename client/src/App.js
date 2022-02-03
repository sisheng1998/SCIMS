import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Routing
import PrivateRoute from './components/routing/PrivateRoute'

// Auth
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

// Dashboard
import Dashboard from './components/app/Dashboard'

const App = () => {
	return (
		<Router>
			<>
				<Routes>
					<Route exact path='/' element={<PrivateRoute />}>
						<Route exact path='/' element={<Dashboard />} />
					</Route>
					<Route exact path='/login' element={<Login />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/forgot-password' element={<ForgotPassword />} />
					<Route
						exact
						path='/reset-password/:resetToken'
						element={<ResetPassword />}
					/>
				</Routes>
			</>
		</Router>
	)
}

export default App
