import { create } from 'zustand';
import { toast } from 'react-toastify';
import api from '../utils/api';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'usage';
  provider: 'stripe' | 'iyzico' | 'admin' | 'system';
  createdAt: string;
  description: string;
}

interface CoinPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  currency: 'USD' | 'EUR' | 'TRY';
}

interface CoinState {
  balance: number;
  transactions: Transaction[];
  packages: CoinPackage[];
  loading: boolean;
  error: string | null;
  
  fetchBalance: () => Promise<number>;
  fetchTransactions: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  purchaseCoins: (packageId: string, paymentMethod: 'stripe' | 'iyzico', paymentDetails: any) => Promise<boolean>;
  useCoins: (amount: number, description: string) => Promise<boolean>;
}

export const useCoinStore = create<CoinState>((set, get) => ({
  balance: 0,
  transactions: [],
  packages: [],
  loading: false,
  error: null,
  
  fetchBalance: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/coins/balance');
      const balance = response.data.balance;
      set({ balance, loading: false });
      return balance;
    } catch (error) {
      set({ 
        error: 'Failed to fetch coin balance', 
        loading: false 
      });
      toast.error('Failed to fetch coin balance');
      return 0;
    }
  },
  
  fetchTransactions: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/coins/transactions');
      set({ 
        transactions: response.data,
        loading: false
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch transactions', 
        loading: false 
      });
      toast.error('Failed to fetch transactions');
    }
  },
  
  fetchPackages: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/coins/packages');
      set({ 
        packages: response.data,
        loading: false
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch coin packages', 
        loading: false 
      });
      toast.error('Failed to fetch coin packages');
    }
  },
  
  purchaseCoins: async (packageId, paymentMethod, paymentDetails) => {
    try {
      set({ loading: true });
      
      const response = await api.post('/coins/purchase', {
        packageId,
        paymentMethod,
        paymentDetails
      });
      
      // Update balance after purchase
      await get().fetchBalance();
      
      set({ loading: false });
      toast.success('Coins purchased successfully!');
      return true;
    } catch (error) {
      set({ 
        error: 'Failed to purchase coins', 
        loading: false 
      });
      toast.error('Failed to purchase coins');
      return false;
    }
  },
  
  useCoins: async (amount, description) => {
    try {
      set({ loading: true });
      
      await api.post('/coins/use', {
        amount,
        description
      });
      
      // Update balance after usage
      await get().fetchBalance();
      
      set({ loading: false });
      return true;
    } catch (error) {
      set({ 
        error: 'Failed to use coins', 
        loading: false 
      });
      toast.error('Not enough coins');
      return false;
    }
  }
}));