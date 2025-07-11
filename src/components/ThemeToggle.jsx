import { useTheme } from "../context/ThemeContext"

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
    >
      {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  )
}

export default ThemeToggle
