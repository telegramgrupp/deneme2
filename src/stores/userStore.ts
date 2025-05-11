import { create } from 'zustand';
import { toast } from 'react-toastify';
import api from '../utils/api';

interface User {
  id: string;
  coins: number;
  createdAt: string;
  isBanned: boolean;
}

interface UserState {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  coins: number;
  fetchUsers: () => Promise<void>;
  banUser: (userId: string) => Promise<boolean>;
  unbanUser: (userId: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  addCoins: (userId: string, amount: number) => Promise<boolean>;
  fetchUserCoins: () => Promise<number>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,
  coins: 0,

  fetchUsers: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/users');
      set({ users: response.data, loading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch users', 
        loading: false 
      });
      toast.error('Failed to fetch users');
    }
  },

  banUser: async (userId) => {
    try {
      set({ loading: true });
      await api.put(`/users/${userId}/ban`);
      
      // Update users list after banning
      const users = get().users.map(user => 
        user.id === userId ? { ...user, isBanned: true } : user
      );
      
      set({ users, loading: false });
      toast.success('User banned successfully');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to ban user');
      return false;
    }
  },

  unbanUser: async (userId) => {
    try {
      set({ loading: true });
      await api.put(`/users/${userId}/unban`);
      
      // Update users list after unbanning
      const users = get().users.map(user => 
        user.id === userId ? { ...user, isBanned: false } : user
      );
      
      set({ users, loading: false });
      toast.success('User unbanned successfully');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to unban user');
      return false;
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ loading: true });
      await api.delete(`/users/${userId}`);
      
      // Update users list after deletion
      const users = get().users.filter(user => user.id !== userId);
      
      set({ users, loading: false });
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to delete user');
      return false;
    }
  },

  addCoins: async (userId, amount) => {
    try {
      set({ loading: true });
      await api.post(`/coins/admin/add`, { userId, amount });
      
      // Update users list after adding coins
      const response = await api.get('/users');
      set({ users: response.data, loading: false });
      
      toast.success(`Added ${amount} coins to user`);
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to add coins');
      return false;
    }
  },

  fetchUserCoins: async () => {
    try {
      const response = await api.get('/coins/balance');
      const coins = response.data.balance;
      set({ coins });
      return coins;
    } catch (error) {
      toast.error('Failed to fetch coin balance');
      return 0;
    }
  }
}));