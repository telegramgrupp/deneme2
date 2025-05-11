import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { connectSocket, disconnectSocket } from '../utils/socket';

const Layout = () => {
  useEffect(() => {
    // Connect to socket when component mounts
    connectSocket();
    
    // Disconnect from socket when component unmounts
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;