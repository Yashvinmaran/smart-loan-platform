import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ApplyLoan from './pages/ApplyLoan'
import TrackStatus from './pages/TrackStatus'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/apply-loan" element={<ApplyLoan />} />
                  <Route path="/track-status/:id" element={<TrackStatus />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  )
}