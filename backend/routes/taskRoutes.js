import express from "express"
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleStatus,
  getUserStats
} from "../controllers/taskController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, getTasks)
router.post("/", authMiddleware, createTask)
router.put("/:id/update", authMiddleware, updateTask)
router.delete("/:id/delete", authMiddleware, deleteTask)
router.patch("/:id/toggle", authMiddleware, toggleStatus)
router.get('/stats', authMiddleware, getUserStats);

export default router
