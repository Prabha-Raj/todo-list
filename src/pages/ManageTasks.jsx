import { useState, useEffect } from "react";
import { 
  getAllTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleTaskStatus 
} from "../api/taskApi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const ManageTasks = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
 
  useEffect(() => {
    fetchTasks();
  }, []);

   
  useEffect(() => {
    applyFilters();
  }, [tasks, searchTerm, statusFilter, sortOption]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await getAllTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tasks];

    
    if (statusFilter === "completed") {
      result = result.filter(task => task.completed);
    } else if (statusFilter === "pending") {
      result = result.filter(task => !task.completed);
    }

   
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term)))
    }

 
    result.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === "name-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "name-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    setFilteredTasks(result);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await createTask({
        title: newTask.title,
        description: newTask.description
      });
      setNewTask({ title: "", description: "" });
      await fetchTasks();
    } catch (err) {
      setError("Failed to add task");
      console.error(err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTaskStatus(id);
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      await updateTask(editingTask._id, {
        title: editingTask.title,
        description: editingTask.description
      });
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("newest");
  };

  if (loading) return (
    <div 
      className="text-center py-8" 
      style={{ color: theme.text }}
    >
      Loading tasks...
    </div>
  );

  return (
    <div 
      className="max-w-6xl mx-auto px-4 py-6"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <h2 className="text-2xl font-bold mb-6">Manage Tasks</h2>
      
      {/* Filters Section */}
      <div 
        className="mb-6 p-4 rounded-lg shadow"
        style={{ 
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Filter */}
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text }}
            >
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text }}
            >
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }}
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          {/* Sort Filter */}
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text }}
            >
              Sort By
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span 
            className="text-sm"
            style={{ color: theme.text === '#1f2937' ? '#6b7280' : '#9ca3af' }}
          >
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
          <button
            onClick={clearFilters}
            className="text-sm px-3 py-1 rounded"
            style={{
              backgroundColor: theme.secondary,
              color: theme.text
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      <form 
        onSubmit={handleAddTask} 
        className="mb-6 p-4 rounded-lg shadow"
        style={{ 
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: theme.text }}
        >
          Add New Task
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            placeholder="Task title"
            className="w-full p-2 border rounded"
            style={{
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border
            }}
            required
          />
          <textarea
            name="description"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            placeholder="Task description (optional)"
            className="w-full p-2 border rounded"
            style={{
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border
            }}
            rows={3}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: theme.primary }}
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Edit Task Modal */}
      {editingTask && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="p-6 rounded-lg shadow-lg w-full max-w-md"
            style={{ 
              backgroundColor: theme.card,
              color: theme.text
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Task</h3>
              <button 
                onClick={() => setEditingTask(null)}
                style={{ color: theme.text }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditTask}>
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }}
                  required
                />
                <textarea
                  name="description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: theme.secondary,
                    color: theme.text
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div 
          className="p-3 mb-4 rounded"
          style={{ 
            color: '#ef4444',
            backgroundColor: theme.background === '#121212' ? '#1f2937' : '#fee2e2'
          }}
        >
          {error}
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div 
            className="text-center py-8 rounded-lg shadow"
            style={{ 
              backgroundColor: theme.card,
              borderColor: theme.border
            }}
          >
            <p style={{ color: theme.text }}>No tasks found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-2 px-3 py-1 text-sm rounded"
              style={{
                backgroundColor: theme.secondary,
                color: theme.text
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task._id}
              className={`p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
                ${task.completed ? 'opacity-70' : ''}
              `}
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleStatus(task._id)}
                    className="h-5 w-5 rounded flex-shrink-0"
                    style={{
                      accentColor: theme.primary
                    }}
                  />
                  <div>
                    {task.completed ? (
                      <s style={{ color: theme.text === '#1f2937' ? '#6b7280' : '#9ca3af' }}>
                        {task.title}
                      </s>
                    ) : (
                      <span className="block font-medium" style={{ color: theme.text }}>
                        {task.title}
                      </span>
                    )}
                    {task.description && (
                      <p 
                        className="text-sm mt-1"
                        style={{ color: theme.text === '#1f2937' ? '#6b7280' : '#9ca3af' }}
                      >
                        {task.description}
                      </p>
                    )}
                    <p 
                      className="text-xs mt-1"
                      style={{ color: theme.text === '#1f2937' ? '#9ca3af' : '#6b7280' }}
                    >
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setEditingTask(task)}
                  className="px-3 py-1 rounded text-sm flex-1 sm:flex-none"
                  style={{
                    backgroundColor: theme.secondary,
                    color: theme.text
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="px-3 py-1 rounded text-sm text-white flex-1 sm:flex-none"
                  style={{ backgroundColor: '#ef4444' }}  
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageTasks;