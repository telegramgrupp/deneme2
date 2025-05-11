import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Video, CreditCard, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCoinStore } from '../stores/coinStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout, username } = useAuthStore();
  const { balance, fetchBalance } = useCoinStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch coin balance when component mounts
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);
  
  // Listen for scroll events to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Video className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">VideoChat</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-gray-700'
            }`}>
              Home
            </Link>
            <Link to="/match" className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/match' ? 'text-primary' : 'text-gray-700'
            }`}>
              Video Chat
            </Link>
            <Link to="/purchase" className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/purchase' ? 'text-primary' : 'text-gray-700'
            }`}>
              Buy Coins
            </Link>
            
            {/* Coins display */}
            <div className="flex items-center space-x-1 text-amber-500 font-semibold">
              <CreditCard className="w-4 h-4" />
              <span>{balance} Coins</span>
            </div>
            
            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Link to="/admin/dashboard" className="text-sm font-medium flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            
            {/* Profile/Login */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">{username}</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/profile" className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/'
                  ? 'text-primary bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/match"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/match'
                  ? 'text-primary bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Video Chat
            </Link>
            <Link
              to="/purchase"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/purchase'
                  ? 'text-primary bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Buy Coins
            </Link>
            
            {/* Coins display for mobile */}
            <div className="px-3 py-2 flex items-center space-x-1 text-amber-500 font-semibold">
              <CreditCard className="w-4 h-4" />
              <span>{balance} Coins</span>
            </div>
            
            {/* Admin Dashboard Link for mobile */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {/* Profile/Login for mobile */}
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  {username}
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;