import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Ban, Eye, Trash2, PlusCircle, MinusCircle, Search } from 'lucide-react';
import { useUserStore } from '../../../stores/userStore';

const UserRow = ({ user, onBan, onUnban, onDelete, onAddCoins }) => {
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [coinAmount, setCoinAmount] = useState(50);
  
  const handleAddCoins = (e) => {
    e.preventDefault();
    onAddCoins(user.id, coinAmount);
    setShowCoinModal(false);
  };
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">{user.id}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {format(new Date(user.createdAt), 'MMM d, yyyy')}
      </td>
      <td className="px-4 py-3 text-sm font-medium">{user.coins}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.isBanned 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {user.isBanned ? 'Banned' : 'Active'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex space-x-2">
          <button 
            onClick={() => onAddCoins(user.id, 50)}
            className="p-1 text-primary hover:bg-primary-50 rounded-full"
            title="Add Coins"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => user.isBanned ? onUnban(user.id) : onBan(user.id)}
            className={`p-1 ${user.isBanned ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'} rounded-full`}
            title={user.isBanned ? 'Unban User' : 'Ban User'}
          >
            <Ban className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(user.id)}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Delete User"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const AdminUsers = () => {
  const { users, loading, fetchUsers, banUser, unbanUser, deleteUser, addCoins } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Update page title
  useEffect(() => {
    document.title = 'User Management - VideoChat Admin';
  }, []);
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Filter users when search term changes
  useEffect(() => {
    if (users) {
      const filtered = users.filter(user => 
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
  const handleBan = async (userId) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      await banUser(userId);
    }
  };
  
  const handleUnban = async (userId) => {
    await unbanUser(userId);
  };
  
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(userId);
    }
  };
  
  const handleAddCoins = async (userId, amount) => {
    const coinAmount = prompt('Enter amount of coins to add:', amount);
    if (coinAmount !== null) {
      await addCoins(userId, parseInt(coinAmount));
    }
  };
  
  // Sample users data for demo
  const sampleUsers = [
    { id: 'user123', createdAt: '2023-06-15T10:20:30Z', coins: 150, isBanned: false },
    { id: 'user456', createdAt: '2023-06-10T14:25:30Z', coins: 250, isBanned: false },
    { id: 'user789', createdAt: '2023-06-05T09:10:15Z', coins: 0, isBanned: true },
    { id: 'user012', createdAt: '2023-06-01T18:30:00Z', coins: 300, isBanned: false },
    { id: 'user345', createdAt: '2023-05-25T12:15:30Z', coins: 75, isBanned: false },
  ];
  
  const displayUsers = users.length > 0 ? filteredUsers : sampleUsers;
  
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage users, ban accounts, and modify coin balances</p>
        </div>
        
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
            <h2 className="text-xl font-semibold">Users</h2>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">User ID</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Created</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Coins</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Status</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onBan={handleBan}
                      onUnban={handleUnban}
                      onDelete={handleDelete}
                      onAddCoins={handleAddCoins}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">User Management Guide</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Banning Users</h3>
              <p className="text-gray-600">
                Banned users cannot access video chat features. They can still log in and view their account, but cannot participate in matches.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Adding Coins</h3>
              <p className="text-gray-600">
                You can add coins to any user account. This is useful for compensating users or providing promotional coins.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Deleting Users</h3>
              <p className="text-gray-600">
                Deleting a user permanently removes all their data. This action cannot be undone, so use with caution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;