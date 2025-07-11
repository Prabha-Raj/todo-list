import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/tasks`,
  withCredentials: true,
})

export const getAllTasks = () => API.get("/")

export const createTask = (data) => API.post("/", data)

export const updateTask = (id, data) => API.put(`/${id}/update`, data)

export const deleteTask = (id) => API.delete(`/${id}/delete`)

export const toggleTaskStatus = (id) => API.patch(`/${id}/toggle`)

export const getStats = () => API.get('/stats')
