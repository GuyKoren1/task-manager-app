import { Outlet } from 'react-router-dom';
import { useDirection } from '../../contexts/DirectionContext';
import Header from './Header';

const MainLayout = () => {
  const { direction } = useDirection();

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
