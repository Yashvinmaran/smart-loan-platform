import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getUserProfile } from '../services/api'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))

        console.log("ProtectedRoute check — token:", token)
        console.log("ProtectedRoute check — user:", user)

        if (!token || !user) {
          setIsAuthenticated(false)
          return
        }

        // Optional: validate by API if needed
        await getUserProfile(user.email || user.id || '') // fallback logic
        setIsAuthenticated(true)
      } catch (error) {
        console.warn("Auth failed:", error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [location])

  if (loading) return <div className="loading-spinner">Loading...</div>

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}
