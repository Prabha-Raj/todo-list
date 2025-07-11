import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import User from "./models/User.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: "https://todoappbyprabha.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(cookieParser())

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 50,
 message:"you have done many request from this IP, so try again later"
})

app.use(limiter)
  

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

app.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user.name);
});


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
