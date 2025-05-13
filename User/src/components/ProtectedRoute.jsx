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
        if (!token) {
          setIsAuthenticated(false)
          return
        }
        
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user?.id) {
          setIsAuthenticated(false)
          return
        }
        
        // Verify token is still valid by making an API call
        await getUserProfile(user.id)
        setIsAuthenticated(true)
      } catch (error) {
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