import Task from "../models/Task.js"
import User from "../models/User.js"

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user })
    res.json(tasks)
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body
    const task = new Task({ title, description, user: req.user })
    await task.save()
    res.status(201).json(task)
  } catch {
    res.status(500).json({ message: "Failed to create task" })
  }
}

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    )
    if (!task) return res.status(404).json({ message: "Task not found" })
    res.json(task)
  } catch {
    res.status(500).json({ message: "Failed to update task" })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user })
    if (!task) return res.status(404).json({ message: "Task not found" })
    res.json({ message: "Task deleted" })
  } catch {
    res.status(500).json({ message: "Failed to delete task" })
  }
}

export const toggleStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user })
    if (!task) return res.status(404).json({ message: "Task not found" })

    task.completed = !task.completed
    await task.save()

    res.json({ message: `Task is marked as ${task.completed ? "Completed" : "Uncompleted"}` })
  } catch {
    res.status(500).json({ message: "Failed to toggle task status" })
  }
}


export const getUserStats = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allTasks = await Task.find({ user: userId });
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
  

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTasks = allTasks.filter(task => 
      task.createdAt && new Date(task.createdAt) > sevenDaysAgo
    ).length;

    const recentCompleted = allTasks.filter(task => 
      task.completed && task.updatedAt && new Date(task.updatedAt) > sevenDaysAgo
    ).length;

    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    const accountAgeMs = new Date() - new Date(user.createdAt);
    const accountAgeDays = Math.max(
      Math.ceil(accountAgeMs / (1000 * 60 * 60 * 24)),
    );

    const avgTasksPerDay = totalTasks > 0 
      ? (totalTasks / accountAgeDays).toFixed(2)
      : 0;

    const tasksWithDescriptions = allTasks.filter(
      task => task.description && task.description.trim() !== ""
    ).length;

    const stats = {
      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        tasksWithDescriptions,
        tasksWithoutDescriptions: totalTasks - tasksWithDescriptions
      },
      recentActivity: {
        tasksCreatedLast7Days: recentTasks,
        tasksCompletedLast7Days: recentCompleted,
        completionStreak: await calculateCompletionStreak(userId)
      },
      productivity: {
        averageTasksPerDay: parseFloat(avgTasksPerDay),
        estimatedWeeklyProductivity: Math.round(parseFloat(avgTasksPerDay) * 7),
        accountAgeDays
      },
      distribution: {
        completedPercentage: completionRate,
        pendingPercentage: 100 - completionRate
      }
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ 
      message: "Failed to fetch user statistics",
      error: error.message 
    });
  }
};


async function calculateCompletionStreak(userId) {
  try {
    const completedTasks = await Task.find({ 
      user: userId,
      completed: true 
    }).sort({ updatedAt: -1 });

    if (completedTasks.length === 0) return 0;

    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date(today);
    
    for (const task of completedTasks) {
      const taskDate = new Date(task.updatedAt).toDateString();
      if (taskDate === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0; 
  }
}