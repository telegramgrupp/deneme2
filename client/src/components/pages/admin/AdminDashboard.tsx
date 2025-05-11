import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Video, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../utils/api';

const StatCard = ({ title, value, icon, color }) => (
  <div className="card">
    <div className="flex items-center">
      <div className={`rounded-full p-4 ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { username } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalCoins: 0,
    activeUsers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Update page title
  useEffect(() => {
    document.title = 'Admin Dashboard - VideoChat';
  }, []);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data from API
        const response = await api.get('/admin/dashboard');
        
        setStats(response.data.stats);
        setChartData(response.data.chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Sample chart data for demo
  const sampleChartData = [
    { name: 'Mon', matches: 40, coins: 120 },
    { name: 'Tue', matches: 30, coins: 100 },
    { name: 'Wed', matches: 45, coins: 150 },
    { name: 'Thu', matches: 50, coins: 180 },
    { name: 'Fri', matches: 65, coins: 220 },
    { name: 'Sat', matches: 80, coins: 300 },
    { name: 'Sun', matches: 70, coins: 250 },
  ];
  
  const displayChartData = chartData.length > 0 ? chartData : sampleChartData;
  
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {username || 'Admin'}!</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers || 124}
                icon={<Users className="h-6 w-6" />}
                color="bg-primary"
              />
              <StatCard 
                title="Total Matches" 
                value={stats.totalMatches || 847}
                icon={<Video className="h-6 w-6" />}
                color="bg-secondary"
              />
              <StatCard 
                title="Total Coins Purchased" 
                value={stats.totalCoins || 12540}
                icon={<CreditCard className="h-6 w-6" />}
                color="bg-accent"
              />
              <StatCard 
                title="Active Users" 
                value={stats.activeUsers || 37}
                icon={<ShieldCheck className="h-6 w-6" />}
                color="bg-green-500"
              />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="matches" name="Matches" fill="#7C3AED" />
                      <Bar dataKey="coins" name="Coins Used" fill="#0D9488" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>User distribution chart would appear here in a production environment.</p>
                    <p className="mt-2 text-sm">This is a demo implementation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Time</th>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">User</th>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Action</th>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">10:24 AM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">User #5782</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Started match</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Matched with User #6109</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">10:15 AM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">User #3421</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Purchased coins</td>
                      <td className="px-4 py-3 text-sm text-gray-600">500 coins for $19.99</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">10:02 AM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">User #6109</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Started match</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Matched with fake video #3</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">9:55 AM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">User #8976</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Registered</td>
                      <td className="px-4 py-3 text-sm text-gray-600">New user joined</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">9:43 AM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">User #2305</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Ended match</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Match duration: 3m 12s</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;