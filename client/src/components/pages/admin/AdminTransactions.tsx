import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DollarSign, CreditCard, Search, Filter, Download, BarChart3 } from 'lucide-react';
import api from '../../../utils/api';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'usage';
  provider: 'stripe' | 'iyzico' | 'admin' | 'system';
  createdAt: string;
  description: string;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Update page title
  useEffect(() => {
    document.title = 'Transaction History - VideoChat Admin';
  }, []);
  
  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Filter transactions when search term or filter changes
  useEffect(() => {
    if (transactions) {
      const filtered = transactions.filter(transaction => {
        const matchesSearch = 
          transaction.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesType = 
          typeFilter === 'all' || 
          (typeFilter === 'purchase' && transaction.type === 'purchase') ||
          (typeFilter === 'usage' && transaction.type === 'usage');
          
        return matchesSearch && matchesType;
      });
      
      setFilteredTransactions(filtered);
    }
  }, [searchTerm, typeFilter, transactions]);
  
  const handleExport = () => {
    // In a real app, this would generate a CSV or other export format
    alert('Export functionality would be implemented here in a production environment.');
  };
  
  // Calculate totals
  const calculateTotals = () => {
    if (!filteredTransactions.length) return { totalPurchased: 0, totalUsed: 0, netCoins: 0 };
    
    const totalPurchased = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalUsed = filteredTransactions
      .filter(t => t.type === 'usage')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      totalPurchased,
      totalUsed,
      netCoins: totalPurchased - totalUsed
    };
  };
  
  const totals = calculateTotals();
  
  // Sample transactions data for demo
  const sampleTransactions = [
    {
      id: 'tx1',
      userId: 'user123',
      amount: 100,
      type: 'purchase',
      provider: 'stripe',
      createdAt: '2023-06-15T10:20:30Z',
      description: 'Purchased 100 coins'
    },
    {
      id: 'tx2',
      userId: 'user123',
      amount: 5,
      type: 'usage',
      provider: 'system',
      createdAt: '2023-06-15T10:30:00Z',
      description: 'Video chat match'
    },
    {
      id: 'tx3',
      userId: 'user456',
      amount: 500,
      type: 'purchase',
      provider: 'iyzico',
      createdAt: '2023-06-14T14:15:30Z',
      description: 'Purchased 500 coins'
    },
    {
      id: 'tx4',
      userId: 'user789',
      amount: 50,
      type: 'purchase',
      provider: 'admin',
      createdAt: '2023-06-13T09:45:00Z',
      description: 'Admin added coins'
    },
    {
      id: 'tx5',
      userId: 'user456',
      amount: 5,
      type: 'usage',
      provider: 'system',
      createdAt: '2023-06-12T18:20:15Z',
      description: 'Video chat match'
    }
  ];
  
  const displayTransactions = transactions.length > 0 ? filteredTransactions : sampleTransactions;
  
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-gray-600">View all coin purchases and usage</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-primary-50 border border-primary-100">
            <div className="flex items-center">
              <div className="rounded-full p-4 bg-primary text-white mr-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-primary-700 text-sm">Total Coins Purchased</h3>
                <p className="text-2xl font-bold text-primary-900">{totals.totalPurchased}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-secondary-50 border border-secondary-100">
            <div className="flex items-center">
              <div className="rounded-full p-4 bg-secondary text-white mr-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-secondary-700 text-sm">Total Coins Used</h3>
                <p className="text-2xl font-bold text-secondary-900">{totals.totalUsed}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-accent-50 border border-accent-100">
            <div className="flex items-center">
              <div className="rounded-full p-4 bg-accent text-white mr-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-accent-700 text-sm">Net Coins Balance</h3>
                <p className="text-2xl font-bold text-accent-900">{totals.netCoins}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by user ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <select 
                  className="input py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="purchase">Purchases</option>
                  <option value="usage">Usage</option>
                </select>
              </div>
              
              <button 
                onClick={handleExport}
                className="btn-outline flex items-center py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Transaction ID</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">User</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Type</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Amount</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Provider</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Date</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.userId}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'purchase' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'purchase' ? 'Purchase' : 'Usage'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <span className={transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.provider === 'stripe' 
                            ? 'bg-blue-100 text-blue-800' 
                            : transaction.provider === 'iyzico'
                            ? 'bg-purple-100 text-purple-800'
                            : transaction.provider === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.provider}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {format(new Date(transaction.createdAt), 'MMM d, h:mm a')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {transaction.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Transaction Providers</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Stripe</h3>
              <p className="text-gray-600">
                Primary payment provider for credit card transactions. Supports multiple currencies and provides detailed transaction reports.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Iyzico</h3>
              <p className="text-gray-600">
                Alternative payment provider optimized for certain regions. Supports local payment methods and currencies.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Admin</h3>
              <p className="text-gray-600">
                Manual coin additions performed by administrators. Used for promotions, compensation, or testing.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">System</h3>
              <p className="text-gray-600">
                Automatic coin deductions by the system for features like video matching or profile unlocks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;