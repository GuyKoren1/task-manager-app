import { Link } from 'react-router-dom';
import { IoCheckmarkCircle, IoSwapHorizontal } from 'react-icons/io5';
import { useDirection } from '../../contexts/DirectionContext';

const Header = () => {
  const { direction, toggleDirection } = useDirection();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <IoCheckmarkCircle className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-gray-900">Task Manager</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Tasks
            </Link>

            <button
              onClick={toggleDirection}
              className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              title={`Switch to ${direction === 'ltr' ? 'RTL' : 'LTR'}`}
            >
              <IoSwapHorizontal size={18} />
              <span className="uppercase">{direction}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
