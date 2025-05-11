import { useEffect, useState } from 'react';
import { CreditCard, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useCoinStore } from '../../stores/coinStore';
import { Link } from 'react-router-dom';
import { socket } from '../../utils/socket';

const ProfilePage = () => {
  const { balance, transactions, fetchBalance, fetchTransactions } = useCoinStore();
  const [loading, setLoading] = useState(true);
  
  // Update page title
  useEffect(() => {
    document.title = 'Your Profile - VideoChat';
  }, []);
  
  // Fetch user data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBalance(),
        fetchTransactions()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchBalance, fetchTransactions]);
  
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Info Card */}
              <div className="card col-span-1 md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Anonymous User</h2>
                  <p className="text-gray-500 mb-6">ID: {socket.id || 'Not connected'}</p>
                  
                  <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-amber-500 mr-2" />
                      <span className="text-gray-700">Balance:</span>
                    </div>
                    <span className="font-semibold text-lg">{balance} coins</span>
                  </div>
                  
                  <Link 
                    to="/purchase" 
                    className="btn-primary w-full mt-4 flex items-center justify-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy More Coins
                  </Link>
                </div>
              </div>
              
              {/* Transaction History */}
              <div className="card col-span-1 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Transaction History
                </h2>
                
                {transactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>No transactions yet</p>
                    <Link to="/purchase" className="text-primary hover:underline mt-2 inline-block">
                      Purchase your first coins
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-2 text-left text-gray-500 font-medium">Date</th>
                          <th className="px-4 py-2 text-left text-gray-500 font-medium">Type</th>
                          <th className="px-4 py-2 text-left text-gray-500 font-medium">Amount</th>
                          <th className="px-4 py-2 text-left text-gray-500 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                            </td>
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
            </div>
          )}
          
          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">How does the coin system work?</h3>
                <p className="text-gray-700">
                  Coins are our virtual currency that you can use to access premium features like starting video chats and unlocking user profiles. Each video chat costs 5 coins.
                </p>
              </div>
              
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">Are my chats recorded?</h3>
                <p className="text-gray-700">
                  We keep basic logs of your activity for security purposes, but your personal video chats are never recorded or stored. Your privacy is important to us.
                </p>
              </div>
              
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">What are fake matches?</h3>
                <p className="text-gray-700">
                  When no real users are available, we may match you with pre-recorded content. These matches still use your coins, but you'll be notified when you're matched with a pre-recorded video.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;