import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, X, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';
import { useVideoStore } from '../../stores/videoStore';
import { socket } from '../../utils/socket';
import { useCoinStore } from '../../stores/coinStore';

const VideoMatchPage = () => {
  const [localStreamReady, setLocalStreamReady] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const fakeVideoRef = useRef<HTMLVideoElement>(null);
  
  const {
    isFinding,
    isMatched,
    localStream,
    remoteStream,
    isFakeMatch,
    fakeVideoPath,
    fakeVideoMuted,
    startFindingMatch,
    stopFindingMatch,
    endCall,
    toggleFakeVideoMuted,
    setLocalStream,
    setRemoteStream,
    cleanupCall
  } = useVideoStore();
  
  const { balance, useCoins } = useCoinStore();

  // Update page title
  useEffect(() => {
    document.title = 'Video Chat - Find a Match';
  }, []);
  
  // Initialize webcam on component mount
  useEffect(() => {
    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setLocalStreamReady(true);
      } catch (error) {
        console.error('Error accessing webcam:', error);
        toast.error('Unable to access your camera or microphone. Please check permissions.');
      }
    };
    
    initializeWebcam();
    
    // Cleanup on component unmount
    return () => {
      cleanupCall();
    };
  }, [setLocalStream, cleanupCall]);
  
  // Handle remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  // Handle fake video
  useEffect(() => {
    if (isFakeMatch && fakeVideoPath && fakeVideoRef.current) {
      fakeVideoRef.current.src = fakeVideoPath;
      fakeVideoRef.current.play().catch(error => console.error('Error playing fake video:', error));
    }
  }, [isFakeMatch, fakeVideoPath]);
  
  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  // Start finding match with coin check
  const handleStartFinding = async () => {
    // Check if we have enough coins (5 coins per match)
    const requiredCoins = 5;
    
    if (balance < requiredCoins) {
      toast.error(`You need at least ${requiredCoins} coins to start a match. Please purchase coins.`);
      return;
    }
    
    // Use coins and start finding match
    const success = await useCoins(requiredCoins, 'Video chat match');
    
    if (success) {
      await startFindingMatch();
    }
  };
  
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Video Chat</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Local Video */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Your Camera</h2>
              <div className="video-container">
                <video 
                  ref={localVideoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                    <VideoOff className="w-16 h-16 text-white opacity-70" />
                  </div>
                )}
                
                {!localStreamReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p>Loading camera...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="flex justify-center space-x-4 mt-4">
                <button 
                  onClick={toggleAudio} 
                  className={`btn p-3 rounded-full ${audioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button 
                  onClick={toggleVideo} 
                  className={`btn p-3 rounded-full ${videoEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Remote Video / Match Finding UI */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-4">
                {isMatched ? 'Connected User' : 'Find a Match'}
              </h2>
              
              <div className="video-container">
                {isMatched ? (
                  <>
                    {/* Show remote video or fake video based on match type */}
                    {isFakeMatch ? (
                      <video 
                        ref={fakeVideoRef}
                        autoPlay 
                        playsInline 
                        loop
                        muted={fakeVideoMuted}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        ref={remoteVideoRef}
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Remote video controls (for fake videos) */}
                    {isFakeMatch && (
                      <div className="absolute bottom-4 left-4 flex space-x-2">
                        <button 
                          onClick={toggleFakeVideoMuted}
                          className="btn p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                        >
                          {fakeVideoMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    )}
                    
                    {/* End call button */}
                    <div className="absolute bottom-4 right-4">
                      <button 
                        onClick={endCall}
                        className="btn p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    {isFinding ? (
                      <div className="text-center p-8">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-800 text-lg font-medium">Finding a match...</p>
                        <p className="text-gray-600 mt-2">This might take a few moments</p>
                        <button
                          onClick={stopFindingMatch}
                          className="mt-6 btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Ready to meet someone new?</h3>
                        <p className="text-gray-600 mb-6">
                          Each match costs 5 coins. You currently have {balance} coins.
                        </p>
                        <button
                          onClick={handleStartFinding}
                          disabled={!localStreamReady || balance < 5}
                          className={`btn-primary animate-matching px-6 py-3 text-lg ${(!localStreamReady || balance < 5) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Start Matching
                        </button>
                        {balance < 5 && (
                          <p className="text-red-500 mt-4">
                            You need at least 5 coins to start a match.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Information */}
          <div className="mt-12 p-6 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">How Video Chat Works</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Each new match costs 5 coins from your balance.</li>
              <li>You may be matched with real users or premium pre-recorded content.</li>
              <li>For privacy reasons, all chats are anonymous.</li>
              <li>Use the controls to mute your microphone or turn off your camera.</li>
              <li>Click the X button to end a chat and return to the matching screen.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMatchPage;