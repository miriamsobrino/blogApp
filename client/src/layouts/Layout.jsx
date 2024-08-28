import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
export const Layout = () => {
  return (
    <div className='overflow-x-hidden'>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
