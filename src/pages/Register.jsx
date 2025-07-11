import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../api/authApi"
import { useTheme } from "../context/ThemeContext"


export const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerUser(form)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
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
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded border"
        />
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
          Register
        </button>
                <span className="my-2 text-gray-400">alrady have an account? <Link to="/" className="text-blue-600">login</Link></span>
      </form>
    </div>
  )
}
