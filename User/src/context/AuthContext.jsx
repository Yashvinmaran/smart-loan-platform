import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserProfile } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (token && storedUser) {
          const userData = JSON.parse(storedUser)
          const freshUserData = await getUserProfile(userData.id)
          setUser(freshUserData)
        }
      } catch (error) {
        logout()
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const updateUser = (updatedData) => {
    const mergedUser = { ...user, ...updatedData }
    localStorage.setItem('user', JSON.stringify(mergedUser))
    setUser(mergedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}