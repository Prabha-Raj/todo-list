import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../api/authApi"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const { setUser } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const res = await loginUser(form)
    localStorage.setItem("user", JSON.stringify(res.data.user))  
    localStorage.setItem("token", res.data.token)  
    console.log(res);
    
    setUser(res.data.user)
    navigate("/dashboard")
  } catch (err) {
    console.log("login failed: ",err)
    setError(err.response?.data?.message || "Login failed")
  }
}
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded shadow-md w-full max-w-md"
        style={{ backgroundColor: theme.card }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded border"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded border"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded text-white"
          style={{ backgroundColor: theme.primary }}
        >
          Login
        </button>
        <span className="my-2 text-gray-400">don't have an account? <Link to="/register" className="text-blue-500">register</Link></span>
      </form>
    </div>
  )
}
