import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getStats } from '../api/taskApi';
import { FiCheckCircle, FiClock, FiTrendingUp, FiList, FiActivity, FiZap } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setLoading(true);
        setStats(data.data);
        setError('');
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    
    const intervalId = setInterval(fetchStats, 30000);
    return () => clearInterval(intervalId);
  }, []);

  
  const completionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: stats ? [stats.overview.completedTasks, stats.overview.pendingTasks] : [0, 0],
        backgroundColor: [theme.primary, '#F44336'], 
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
        borderWidth: 1,
      }
    ]
  };

  const activityData = {
    labels: ['Created (7 days)', 'Completed (7 days)'],
    datasets: [
      {
        label: 'Recent Activity',
        data: stats ? [stats.recentActivity.tasksCreatedLast7Days, stats.recentActivity.tasksCompletedLast7Days] : [0, 0],
        backgroundColor: [theme.primary, theme.secondary], 
        borderColor: [theme.primary, theme.secondary], 
        borderWidth: 1
      }
    ]
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6" style={{ backgroundColor: theme.background, color: theme.text }}>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="max-w-6xl mx-auto px-4 py-6"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Welcome Banner */}
      <div 
        className="p-6 rounded-lg shadow mb-6"
        style={{ 
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <h3 className="text-xl font-semibold mb-2">
          Welcome back, <span style={{ color: theme.primary }}>{user?.name}</span>!
        </h3>
        <p style={{ color: theme.text }}>
          {loading ? (
            <Skeleton width={200} />
          ) : (
            stats?.overview.completionRate >= 50 ? 
              "Great progress! Keep up the good work!" : 
              "Let's get started with your tasks!"
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Tasks" 
          value={stats?.overview.totalTasks || 0} 
          icon={<FiList style={{ color: theme.primary }} size={24} />}
          loading={loading}
          theme={theme}
        />
        <StatCard 
          title="Completed" 
          value={stats?.overview.completedTasks || 0} 
          icon={<FiCheckCircle className="text-green-500" size={24} />}
          loading={loading}
          theme={theme}
        />
        <StatCard 
          title="Pending" 
          value={stats?.overview.pendingTasks || 0} 
          icon={<FiClock className="text-yellow-500" size={24} />}
          loading={loading}
          theme={theme}
        />
        <StatCard 
          title="Completion Rate" 
          value={stats ? `${stats.overview.completionRate}%` : '0%'} 
          icon={<FiTrendingUp className="text-purple-500" size={24} />}
          loading={loading}
          theme={theme}
        />
      </div>

      {/* Completion Progress */}
      <div 
        className="p-4 rounded-lg shadow mb-6"
        style={{ backgroundColor: theme.card }}
      >
        <div className="flex justify-between mb-2">
          <span className="font-medium">Task Completion Progress</span>
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <span>{stats?.overview.completedTasks || 0}/{stats?.overview.totalTasks || 0} tasks</span>
          )}
        </div>
        {loading ? (
          <Skeleton height={16} />
        ) : (
          <div 
            className="w-full rounded-full h-4"
            style={{ backgroundColor: theme.background === '#121212' ? '#374151' : '#e5e7eb' }}
          >
            <div 
              className="h-4 rounded-full transition-all duration-500 ease-in-out" 
              style={{ 
                width: `${stats?.distribution.completedPercentage || 0}%`,
                minWidth: '8px',
                backgroundColor: theme.primary
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Completion Pie Chart */}
        <div 
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: theme.card }}
        >
          <h3 className="font-semibold mb-4">Task Completion</h3>
          <div className="h-64">
            {loading ? (
              <Skeleton height={256} />
            ) : (
              <Pie 
                data={completionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: theme.text,
                        font: {
                          family: 'Inter, sans-serif'
                        }
                      }
                    },
                    tooltip: {
                      enabled: !loading
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Activity Bar Chart */}
        <div 
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: theme.card }}
        >
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="h-64">
            {loading ? (
              <Skeleton height={256} />
            ) : (
              <Bar
                data={activityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        color: theme.text
                      },
                      grid: {
                        color: theme.border
                      }
                    },
                    x: {
                      ticks: {
                        color: theme.text
                      },
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Productivity Stats */}
        <div 
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: theme.card }}
        >
          <div className="flex items-center mb-4">
            <FiZap style={{ color: theme.primary }} className="mr-2" />
            <h3 className="font-semibold">Productivity</h3>
          </div>
          <div className="space-y-3">
            <StatItem 
              label="Average tasks per day" 
              value={loading ? <Skeleton width={50} /> : stats?.productivity.averageTasksPerDay}
              theme={theme}
            />
            <StatItem 
              label="Estimated weekly productivity" 
              value={loading ? <Skeleton width={50} /> : stats?.productivity.estimatedWeeklyProductivity}
              theme={theme}
            />
            <StatItem 
              label="Account age" 
              value={loading ? <Skeleton width={80} /> : 
                `${stats?.productivity.accountAgeDays} day${stats?.productivity.accountAgeDays !== 1 ? 's' : ''}`
              }
              theme={theme}
            />
            <StatItem 
              label="Tasks with descriptions" 
              value={loading ? <Skeleton width={100} /> : 
                `${stats?.overview.tasksWithDescriptions} (${Math.round(
                  (stats?.overview.tasksWithDescriptions / (stats?.overview.totalTasks || 1)) * 100
                )}%)`
              }
              theme={theme}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div 
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: theme.card }}
        >
          <div className="flex items-center mb-4">
            <FiActivity style={{ color: theme.primary }} className="mr-2" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            <StatItem 
              label="Tasks created last week" 
              value={loading ? <Skeleton width={50} /> : stats?.recentActivity.tasksCreatedLast7Days}
              theme={theme}
            />
            <StatItem 
              label="Tasks completed last week" 
              value={loading ? <Skeleton width={50} /> : stats?.recentActivity.tasksCompletedLast7Days}
              theme={theme}
            />
            <StatItem 
              label="Current completion streak" 
              value={loading ? <Skeleton width={80} /> : 
                `${stats?.recentActivity.completionStreak} day${stats?.recentActivity.completionStreak !== 1 ? 's' : ''}`
              }
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, loading, theme }) => (
  <div 
    className="p-4 rounded-lg shadow border-l-4"
    style={{ 
      backgroundColor: theme.card,
      borderColor: theme.primary
    }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p style={{ color: theme.text }}>{title}</p>
        {loading ? (
          <Skeleton width={60} height={28} />
        ) : (
          <p className="text-2xl font-bold" style={{ color: theme.text }}>{value}</p>
        )}
      </div>
      <div 
        className="p-2 rounded-full"
        style={{ backgroundColor: theme.background === '#121212' ? '#2d3748' : '#e5e7eb' }}
      >
        {icon}
      </div>
    </div>
  </div>
);


const StatItem = ({ label, value, theme }) => (
  <div 
    className="flex justify-between items-center py-2 border-b last:border-0"
    style={{ borderColor: theme.border }}
  >
    <span style={{ color: theme.text }}>{label}</span>
    <span className="font-medium" style={{ color: theme.text }}>{value}</span>
  </div>
);

export default Dashboard;