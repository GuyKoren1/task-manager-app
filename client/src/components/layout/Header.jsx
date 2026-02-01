import { Link } from 'react-router-dom';
import { IoCheckmarkCircle, IoSwapHorizontal } from 'react-icons/io5';
import { useDirection } from '../../contexts/DirectionContext';

const Header = () => {
  const { direction, toggleDirection } = useDirection();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2">
            <IoCheckmarkCircle className="text-blue-600" size={28} />
            <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:inline">Task Manager</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 xs:hidden">Tasks</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">📊</span>
            </Link>
            <Link
              to="/tasks"
              className="text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Tasks</span>
              <span className="sm:hidden">✓</span>
            </Link>

            <button
              onClick={toggleDirection}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              title={`Switch to ${direction === 'ltr' ? 'RTL' : 'LTR'}`}
            >
              <IoSwapHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="uppercase text-xs">{direction}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
