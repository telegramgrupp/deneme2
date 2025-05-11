import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import api from '../utils/api';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      token: null,
      username: null,
      loading: false,

      login: async (username, password) => {
        try {
          set({ loading: true });
          
          const response = await api.post('/auth/admin/login', { username, password });
          const { token } = response.data;
          
          if (token) {
            set({ 
              isAuthenticated: true, 
              isAdmin: true, 
              token, 
              username,
              loading: false 
            });
            
            // Set token for API calls
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            toast.success('Admin login successful');
            return true;
          }
          
          return false;
        } catch (error) {
          toast.error('Invalid credentials');
          set({ loading: false });
          return false;
        }
      },

      logout: () => {
        // Remove token from API calls
        delete api.defaults.headers.common['Authorization'];
        
        set({ 
          isAuthenticated: false, 
          isAdmin: false, 
          token: null, 
          username: null 
        });
        
        toast.info('Logged out successfully');
      },

      checkAuth: () => {
        const { token } = get();
        
        if (token) {
          // Set token for API calls if available
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin, 
        token: state.token,
        username: state.username 
      }),
    }
  )
);