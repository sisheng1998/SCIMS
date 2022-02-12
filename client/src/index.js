import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<AuthProvider>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</AuthProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)
