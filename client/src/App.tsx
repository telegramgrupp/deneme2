import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from './stores/authStore';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import Layout from './components/Layout';
import HomePage from './components/pages/HomePage';
import VideoMatchPage from './components/pages/VideoMatchPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminLoginPage from './components/pages/AdminLoginPage';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import AdminUsers from './components/pages/admin/AdminUsers';
import AdminMatches from './components/pages/admin/AdminMatches';
import AdminTransactions from './components/pages/admin/AdminTransactions';
import PurchaseCoinsPage from './components/pages/PurchaseCoinsPage';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_stripe_publishable_key');

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if admin is logged in on app start
    checkAuth();
  }, [checkAuth]);

  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="match" element={<VideoMatchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="purchase" element={<PurchaseCoinsPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminProtectedRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Elements>
  );
}

export default App;