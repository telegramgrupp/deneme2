import { create } from 'zustand';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { socket } from '../utils/socket';

interface VideoState {
  isFinding: boolean;
  isMatched: boolean;
  isConnected: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isFakeMatch: boolean;
  matchId: string | null;
  matchedUserId: string | null;
  fakeVideoPath: string | null;
  fakeVideoMuted: boolean;
  error: string | null;
  
  startFindingMatch: () => Promise<void>;
  stopFindingMatch: () => void;
  endCall: () => void;
  toggleFakeVideoMuted: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  cleanupCall: () => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  isFinding: false,
  isMatched: false,
  isConnected: false,
  localStream: null,
  remoteStream: null,
  isFakeMatch: false,
  matchId: null,
  matchedUserId: null,
  fakeVideoPath: null,
  fakeVideoMuted: false,
  error: null,
  
  startFindingMatch: async () => {
    try {
      set({ 
        isFinding: true,
        error: null
      });

      // Emit socket event to start finding a match
      socket.emit('find_match');
      
      // Setup socket listeners for matching
      socket.on('match_found', (data) => {
        const { matchId, userId, isFake, videoPath } = data;
        
        set({ 
          isMatched: true,
          isFinding: false,
          matchId,
          matchedUserId: userId,
          isFakeMatch: isFake,
          fakeVideoPath: isFake ? videoPath : null,
        });
        
        toast.success('Match found!');
      });
      
      socket.on('match_error', (error) => {
        set({ 
          isFinding: false,
          error: error.message 
        });
        toast.error(error.message);
      });
    } catch (error) {
      set({ 
        isFinding: false,
        error: 'Failed to initialize video chat' 
      });
      toast.error('Failed to initialize video chat');
    }
  },
  
  stopFindingMatch: () => {
    socket.emit('cancel_find_match');
    set({ isFinding: false });
  },
  
  endCall: () => {
    const { matchId } = get();
    
    if (matchId) {
      socket.emit('end_call', { matchId });
    }
    
    get().cleanupCall();
  },
  
  toggleFakeVideoMuted: () => {
    set((state) => ({ fakeVideoMuted: !state.fakeVideoMuted }));
  },
  
  setLocalStream: (stream) => {
    set({ localStream: stream });
  },
  
  setRemoteStream: (stream) => {
    set({ remoteStream: stream });
  },
  
  cleanupCall: () => {
    // Stop local stream tracks
    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Reset state
    set({
      isMatched: false,
      isConnected: false,
      remoteStream: null,
      matchId: null,
      matchedUserId: null,
      isFakeMatch: false,
      fakeVideoPath: null,
    });
  }
}));