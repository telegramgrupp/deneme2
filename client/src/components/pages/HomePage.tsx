import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CreditCard, ShieldCheck, Users } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  // Update page title
  useEffect(() => {
    document.title = 'VideoChat - Random Video Chat Application';
  }, []);

  const handleStartChatting = () => {
    navigate('/match');
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Instant <span className="text-primary">Video Connections</span> with Anyone
              </h1>
              <p className="text-xl text-gray-600">
                Join our platform for random video chats. Meet new people, make friends, and explore connections around the world.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleStartChatting}
                  className="btn-primary animate-matching px-8 py-3 text-lg flex items-center justify-center"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Chatting
                </button>
                <button 
                  onClick={() => navigate('/purchase')}
                  className="btn-outline px-8 py-3 text-lg flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Coins
                </button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="w-full h-[400px] bg-gradient-to-br from-primary-300 to-secondary-300 rounded-2xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-32 h-32 text-white opacity-80" />
                </div>
                <div className="absolute top-6 right-6 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary rounded-xl shadow-lg transform -rotate-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent rounded-full shadow-lg flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose VideoChat</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed to enhance your video chat experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card neumorphic p-8 hover:scale-105 transition-transform">
              <div className="rounded-full bg-primary-100 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Matching</h3>
              <p className="text-gray-600">
                Our advanced algorithm connects you with users in seconds. Choose between real users or pre-recorded content.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card neumorphic p-8 hover:scale-105 transition-transform">
              <div className="rounded-full bg-secondary-100 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coin System</h3>
              <p className="text-gray-600">
                Purchase coins to unlock premium features like extended chats, profile views, and exclusive content.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card neumorphic p-8 hover:scale-105 transition-transform">
              <div className="rounded-full bg-accent-100 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy & Security</h3>
              <p className="text-gray-600">
                Your safety is our priority. Anonymous chats with enforced community guidelines and reporting features.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with VideoChat is easy and intuitive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Anonymously</h3>
              <p className="text-gray-600">
                No registration required. Start immediately with a randomly assigned ID.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Matching</h3>
              <p className="text-gray-600">
                Click the match button and our system will find you a chat partner.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat & Connect</h3>
              <p className="text-gray-600">
                Enjoy real-time video conversations with your matched partner.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Buy Coins</h3>
              <p className="text-gray-600">
                Purchase coins to unlock premium features and enhance your experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Meeting New People?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users already enjoying random video chats on our platform.
          </p>
          <button 
            onClick={handleStartChatting}
            className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform transition hover:scale-105"
          >
            Start Video Chat Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;