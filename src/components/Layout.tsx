import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, CreditCard, User, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCoinStore } from '../stores/coinStore';

function Layout() {
  const location = useLocation();
  const { isAdmin, isAuthenticated } = useAuthStore();
  const { balance, fetchBalance } = useCoinStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Video className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">VideoChat</span>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              {/* Main Navigation */}
              <Link
                to="/match"
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/match' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Video Chat
              </Link>

              {/* Coins Display */}
              <div className="flex items-center space-x-1 px-3 py-1 bg-amber-50 rounded-full">
                <CreditCard className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">{balance} Coins</span>
              </div>

              {/* Admin Link */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Profile/Login */}
              <Link
                to={isAuthenticated ? "/profile" : "/admin/login"}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                <User className="h-4 w-4" />
                <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
              </Link>

              {/* Purchase Coins Button */}
              <Link
                to="/purchase"
                className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors flex items-center space-x-1"
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Coins</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-gray-400" />
              <span className="text-sm text-gray-600">© 2025 VideoChat. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-primary-600">Terms</Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary-600">Privacy</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;