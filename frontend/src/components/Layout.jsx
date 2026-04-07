import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />
      <main className="px-3 sm:px-5 lg:px-8 xl:px-12 py-5 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
