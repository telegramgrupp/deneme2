import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, isAuthenticated, isAdmin, loading } = useAuthStore();
  const navigate = useNavigate();
  
  // Update page title
  useEffect(() => {
    document.title = 'Admin Login - VideoChat';
  }, []);
  
  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!username || !password) {
      setFormError('Username and password are required');
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setFormError('Invalid username or password');
    }
  };
  
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>
        
        <div className="card">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-3 flex items-center justify-center ${
                loading ? 'opacity-70' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Log In
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            For demo purposes, use:
          </p>
          <p className="mt-1">
            <span className="font-semibold">Username:</span> admin
          </p>
          <p>
            <span className="font-semibold">Password:</span> securepassword
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;