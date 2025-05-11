import Peer from 'peerjs';
import { socket } from './socket';

let peer: Peer | null = null;
let peerConnection: RTCPeerConnection | null = null;

// Initialize WebRTC peer
export const initPeer = (userId: string): Promise<Peer> => {
  return new Promise((resolve, reject) => {
    try {
      peer = new Peer(userId, {
        host: import.meta.env.VITE_API_URL || 'localhost',
        port: Number(import.meta.env.VITE_PEER_PORT) || 4000,
        path: '/peerjs',
        debug: 3,
      });
      
      peer.on('open', (id) => {
        console.log('Peer connection opened with ID:', id);
        resolve(peer as Peer);
      });
      
      peer.on('error', (error) => {
        console.error('Peer connection error:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Failed to initialize peer:', error);
      reject(error);
    }
  });
};

// Call another peer
export const callPeer = (peerId: string, stream: MediaStream): Promise<MediaStream> => {
  return new Promise((resolve, reject) => {
    if (!peer) {
      reject(new Error('Peer not initialized'));
      return;
    }
    
    const call = peer.call(peerId, stream);
    
    call.on('stream', (remoteStream) => {
      resolve(remoteStream);
    });
    
    call.on('error', (error) => {
      reject(error);
    });
    
    call.on('close', () => {
      console.log('Call closed');
    });
  });
};

// Answer incoming calls
export const answerCalls = (stream: MediaStream, onStream: (stream: MediaStream) => void): void => {
  if (!peer) {
    console.error('Peer not initialized');
    return;
  }
  
  peer.on('call', (call) => {
    call.answer(stream);
    
    call.on('stream', (remoteStream) => {
      onStream(remoteStream);
    });
    
    call.on('error', (error) => {
      console.error('Call error:', error);
    });
  });
};

// Create RTCPeerConnection with ICE servers
export const createPeerConnection = (): RTCPeerConnection => {
  peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  });
  
  return peerConnection;
};

// Clean up peer connections
export const cleanupPeer = (): void => {
  if (peer) {
    peer.destroy();
    peer = null;
  }
  
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
};

// Handle ICE candidate exchange via socket
export const setupIceCandidateHandling = (
  peerConnection: RTCPeerConnection, 
  userId: string, 
  targetUserId: string
): void => {
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice_candidate', {
        candidate: event.candidate,
        from: userId,
        to: targetUserId,
      });
    }
  };
  
  socket.on('ice_candidate', (data) => {
    if (data.to === userId && data.from === targetUserId) {
      peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch((error) => console.error('Error adding ICE candidate:', error));
    }
  });
};