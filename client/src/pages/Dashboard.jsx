import { format } from 'date-fns';
import { IoCheckmarkCircle, IoTime, IoFlag, IoCalendar } from 'react-icons/io5';
import { useStatistics, useUpcomingTasks } from '../hooks/useTasks';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useStatistics();
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingTasks();

  const stats = statsData?.data;
  const upcomingTasks = upcomingData?.data || [];

  if (statsLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats?.total || 0}
          icon={IoCheckmarkCircle}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending"
          value={stats?.byStatus?.pending || 0}
          icon={IoTime}
          color="bg-gray-500"
        />
        <StatCard
          title="In Progress"
          value={stats?.byStatus?.in_progress || 0}
          icon={IoFlag}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completed"
          value={stats?.byStatus?.completed || 0}
          icon={IoCheckmarkCircle}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks by Priority</h2>
          <div className="space-y-3">
            {['high', 'medium', 'low'].map((priority) => {
              const count = stats?.byPriority?.[priority] || 0;
              const total = stats?.total || 1;
              const percentage = Math.round((count / total) * 100);

              return (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize flex items-center space-x-2">
                      <Badge variant={priority}>{priority}</Badge>
                    </span>
                    <span className="text-sm text-gray-600">{count} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'high' ? 'bg-red-500' :
                        priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            <IoCalendar className="text-gray-400" size={24} />
          </div>

          {upcomingLoading ? (
            <Loading size="sm" />
          ) : upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {upcomingTasks.map((task) => (
                <div key={task._id} className="border-l-4 border-l-blue-500 pl-3 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={task.priority}>{task.priority}</Badge>
                        <span className="text-xs text-gray-500">
                          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/tasks"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Tasks
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
