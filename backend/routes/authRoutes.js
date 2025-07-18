import express from "express"
import { register, login, logout } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)
router.get("/check", authMiddleware, (req, res) => {
  res.json({ message: "User is logged in", userId: req.user })
})


export default router
