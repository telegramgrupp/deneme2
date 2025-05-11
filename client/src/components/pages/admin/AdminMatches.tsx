import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Play, Search, Filter, Download, Clock, User, Video } from 'lucide-react';
import api from '../../../utils/api';

interface Match {
  id: string;
  userId: string;
  matchedWith: string;
  isFake: boolean;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  videoPath: string | null;
}

const VideoPlayer = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-4xl w-full">
        <div className="p-4 bg-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Video Playback</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <video controls className="w-full aspect-video bg-black">
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

const AdminMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filterFake, setFilterFake] = useState<boolean | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  
  // Update page title
  useEffect(() => {
    document.title = 'Match History - VideoChat Admin';
  }, []);
  
  // Fetch matches on component mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/matches');
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);
  
  // Filter matches when search term or filter changes
  useEffect(() => {
    if (matches) {
      const filtered = matches.filter(match => {
        const matchesSearch = 
          match.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.matchedWith.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesFilter = 
          filterFake === null || match.isFake === filterFake;
          
        return matchesSearch && matchesFilter;
      });
      
      setFilteredMatches(filtered);
    }
  }, [searchTerm, filterFake, matches]);
  
  const formatDuration = (seconds: number) => {
    if (!seconds) return '--';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const handlePlayVideo = (videoPath: string) => {
    setCurrentVideo(videoPath);
  };
  
  const handleCloseVideo = () => {
    setCurrentVideo(null);
  };
  
  const handleExport = () => {
    // In a real app, this would generate a CSV or other export format
    alert('Export functionality would be implemented here in a production environment.');
  };
  
  // Sample matches data for demo
  const sampleMatches = [
    {
      id: 'match1',
      userId: 'user123',
      matchedWith: 'user456',
      isFake: false,
      startTime: '2023-06-15T10:20:30Z',
      endTime: '2023-06-15T10:25:45Z',
      duration: 315,
      videoPath: null
    },
    {
      id: 'match2',
      userId: 'user789',
      matchedWith: 'fake1',
      isFake: true,
      startTime: '2023-06-14T14:30:00Z',
      endTime: '2023-06-14T14:33:20Z',
      duration: 200,
      videoPath: '/fakeVideos/video1.mp4'
    },
    {
      id: 'match3',
      userId: 'user456',
      matchedWith: 'user123',
      isFake: false,
      startTime: '2023-06-13T09:15:10Z',
      endTime: '2023-06-13T09:20:30Z',
      duration: 320,
      videoPath: null
    },
    {
      id: 'match4',
      userId: 'user012',
      matchedWith: 'fake2',
      isFake: true,
      startTime: '2023-06-12T18:05:45Z',
      endTime: '2023-06-12T18:10:15Z',
      duration: 270,
      videoPath: '/fakeVideos/video2.mp4'
    },
    {
      id: 'match5',
      userId: 'user345',
      matchedWith: 'user678',
      isFake: false,
      startTime: '2023-06-11T12:40:20Z',
      endTime: '2023-06-11T12:52:10Z',
      duration: 710,
      videoPath: null
    }
  ];
  
  const displayMatches = matches.length > 0 ? filteredMatches : sampleMatches;
  
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Match History</h1>
          <p className="text-gray-600">View and manage all video chat matches</p>
        </div>
        
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by user ID..."
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
                  value={filterFake === null ? 'all' : filterFake ? 'fake' : 'real'}
                  onChange={(e) => {
                    if (e.target.value === 'all') setFilterFake(null);
                    else if (e.target.value === 'fake') setFilterFake(true);
                    else setFilterFake(false);
                  }}
                >
                  <option value="all">All Matches</option>
                  <option value="real">Real Matches</option>
                  <option value="fake">Fake Matches</option>
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
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Match ID</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">User</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Matched With</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Type</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Time</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Duration</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{match.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{match.userId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{match.matchedWith}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          match.isFake 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {match.isFake ? 'Fake' : 'Real'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {format(new Date(match.startTime), 'MMM d, h:mm a')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDuration(match.duration!)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {match.isFake && match.videoPath && (
                          <button 
                            onClick={() => handlePlayVideo(match.videoPath!)}
                            className="p-1 text-primary hover:bg-primary-50 rounded-full"
                            title="Play Video"
                          >
                            <Play className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Match Statistics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">Total Matches</span>
                <span className="font-semibold">{displayMatches.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">Real User Matches</span>
                <span className="font-semibold">{displayMatches.filter(m => !m.isFake).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">Fake Video Matches</span>
                <span className="font-semibold">{displayMatches.filter(m => m.isFake).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">Average Duration</span>
                <span className="font-semibold">
                  {formatDuration(
                    Math.floor(
                      displayMatches.reduce((sum, match) => sum + (match.duration || 0), 0) / 
                      (displayMatches.length || 1)
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold">Fake Videos</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                The system uses a selection of pre-recorded videos when no real matches are available. 
                These videos help maintain user engagement during low-traffic periods.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="bg-gray-50 p-3 rounded-md flex items-center space-x-2">
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                      <Play className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Video #{num}</div>
                      <div className="text-xs text-gray-500">~2 min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {currentVideo && (
        <VideoPlayer src={currentVideo} onClose={handleCloseVideo} />
      )}
    </div>
  );
};

export default AdminMatches;