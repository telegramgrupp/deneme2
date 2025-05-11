import { useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Video, CreditCard, User, Shield, Menu, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCoinStore } from '../stores/coinStore';
import { useState } from 'react';

function Layout() {
  const location = useLocation();
  const { isAdmin, isAuthenticated } = useAuthStore();
  const { balance, fetchBalance } = useCoinStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchBalance();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchBalance]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <Video className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  VideoChat
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/match"
                className={`nav-link ${
                  location.pathname === '/match' ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                Video Chat
              </Link>

              <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full shadow-sm">
                <CreditCard className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">{balance} Coins</span>
              </div>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 nav-link nav-link-inactive"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}

              <Link
                to={isAuthenticated ? "/profile" : "/admin/login"}
                className="flex items-center space-x-1 nav-link nav-link-inactive"
              >
                <User className="h-4 w-4" />
                <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
              </Link>

              <Link
                to="/purchase"
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-1"
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Coins</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link
                to="/match"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Video Chat
              </Link>

              <div className="px-3 py-2 flex items-center space-x-1">
                <CreditCard className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 font-medium">{balance} Coins</span>
              </div>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              <Link
                to={isAuthenticated ? "/profile" : "/admin/login"}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? 'Profile' : 'Login'}
              </Link>

              <Link
                to="/purchase"
                className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy Coins
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Video className="h-6 w-6 text-primary-600" />
                <span className="text-lg font-bold text-gray-900">VideoChat</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Connect with people around the world through instant video chat.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
              <div className="mt-4 space-y-2">
                <Link to="/match" className="block text-sm text-gray-600 hover:text-primary-600">Video Chat</Link>
                <Link to="/purchase" className="block text-sm text-gray-600 hover:text-primary-600">Buy Coins</Link>
                <Link to="/profile" className="block text-sm text-gray-600 hover:text-primary-600">Profile</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
              <div className="mt-4 space-y-2">
                <Link to="/terms" className="block text-sm text-gray-600 hover:text-primary-600">Terms of Service</Link>
                <Link to="/privacy" className="block text-sm text-gray-600 hover:text-primary-600">Privacy Policy</Link>
                <Link to="/contact" className="block text-sm text-gray-600 hover:text-primary-600">Contact Us</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              © {new Date().getFullYear()} VideoChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;