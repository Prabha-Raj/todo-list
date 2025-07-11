import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/check`, { 
        withCredentials: true 
      })
      
      const userData = res.data.user || { id: res.data.userId }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch {
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  const logout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { 
      withCredentials: true 
    })
    localStorage.removeItem("user")
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
