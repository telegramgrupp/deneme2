import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

// Get current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Queue for users waiting to be matched
let matchQueue: string[] = [];

// Keep track of fake videos used per user to avoid repeats
const userFakeVideoHistory: Record<string, string[]> = {};

// Setup Socket.IO event handlers
const setupSocketHandlers = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    logger.info(`New socket connection: ${socket.id}`);
    
    // Create or update user on connection
    let user = await prisma.user.findUnique({
      where: { socketId: socket.id }
    });
    
    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          socketId: socket.id,
          // Create coin record for new user
          coins: {
            create: {
              balance: 10 // Give new users 10 free coins
            }
          }
        }
      });
      
      // Initialize fake video history for this user
      userFakeVideoHistory[user.id] = [];
      
      logger.info(`Created new user with ID: ${user.id}`);
    } else {
      // Update existing user's socket ID and last seen
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          socketId: socket.id,
          lastSeen: new Date()
        }
      });
      
      logger.info(`Updated existing user with ID: ${user.id}`);
    }
    
    // Handle find match request
    socket.on('find_match', async () => {
      logger.info(`User ${user!.id} requested to find a match`);
      
      // Check if user is banned
      const currentUser = await prisma.user.findUnique({
        where: { id: user!.id },
        include: { coins: true }
      });
      
      if (!currentUser) {
        socket.emit('match_error', { message: 'User not found' });
        return;
      }
      
      if (currentUser.isBanned) {
        socket.emit('match_error', { message: 'Your account has been banned' });
        return;
      }
      
      // Check if user has enough coins
      if (!currentUser.coins || currentUser.coins.balance < 5) {
        socket.emit('match_error', { message: 'Not enough coins' });
        return;
      }
      
      // Add user to match queue
      matchQueue.push(user!.id);
      
      // Try to match with another user
      if (matchQueue.length >= 2) {
        // Get two users from the queue
        const userId1 = matchQueue.shift()!;
        const userId2 = matchQueue.shift()!;
        
        // Don't match a user with themselves
        if (userId1 === userId2) {
          matchQueue.push(userId2); // Put the second user back in queue
          return;
        }
        
        // Create a match between these users
        const match = await prisma.match.create({
          data: {
            userId: userId1,
            matchedWith: userId2,
            isFake: false
          }
        });
        
        // Use 5 coins from each user
        for (const userId of [userId1, userId2]) {
          // Get user's coins
          const userCoins = await prisma.coin.findUnique({
            where: { userId }
          });
          
          if (userCoins) {
            // Update coins
            await prisma.coin.update({
              where: { userId },
              data: {
                balance: userCoins.balance - 5
              }
            });
            
            // Create transaction record
            await prisma.transaction.create({
              data: {
                userId,
                amount: 5,
                type: 'usage',
                provider: 'system',
                description: 'Video chat match'
              }
            });
          }
        }
        
        // Get socket IDs for both users
        const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
        const user2 = await prisma.user.findUnique({ where: { id: userId2 } });
        
        if (user1 && user2) {
          // Notify both users of the match
          io.to(user1.socketId!).emit('match_found', {
            matchId: match.id,
            userId: userId2,
            isFake: false
          });
          
          io.to(user2.socketId!).emit('match_found', {
            matchId: match.id,
            userId: userId1,
            isFake: false
          });
          
          logger.info(`Matched users ${userId1} and ${userId2}`);
        }
      } else {
        // If no real users available, match with fake video after a delay
        setTimeout(async () => {
          // Check if user is still in queue
          const userIndex = matchQueue.indexOf(user!.id);
          if (userIndex !== -1) {
            // Remove user from queue
            matchQueue.splice(userIndex, 1);
            
            // Select a random fake video
            const fakeVideos = await prisma.fakeVideo.findMany({
              where: { isActive: true }
            });
            
            if (fakeVideos.length === 0) {
              // If no fake videos available, try matching with public directory videos
              const fakeVideosDir = path.join(__dirname, '../../public/fakeVideos');
              
              // Ensure directory exists
              if (!fs.existsSync(fakeVideosDir)) {
                fs.mkdirSync(fakeVideosDir, { recursive: true });
                socket.emit('match_error', { message: 'No matches available. Please try again later.' });
                return;
              }
              
              // Get list of MP4 files
              let fakeVideoFiles = fs.readdirSync(fakeVideosDir)
                .filter(file => file.endsWith('.mp4'));
              
              if (fakeVideoFiles.length === 0) {
                socket.emit('match_error', { message: 'No matches available. Please try again later.' });
                return;
              }
              
              // Filter out videos the user has already seen, if possible
              const userHistory = userFakeVideoHistory[user!.id] || [];
              let availableVideos = fakeVideoFiles.filter(video => !userHistory.includes(video));
              
              // If all videos have been seen, reset history
              if (availableVideos.length === 0) {
                userFakeVideoHistory[user!.id] = [];
                availableVideos = fakeVideoFiles;
              }
              
              // Select a random video
              const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
              
              // Add to user's history
              if (!userFakeVideoHistory[user!.id]) {
                userFakeVideoHistory[user!.id] = [];
              }
              userFakeVideoHistory[user!.id].push(randomVideo);
              
              // Keep history at a reasonable size
              if (userFakeVideoHistory[user!.id].length > 10) {
                userFakeVideoHistory[user!.id].shift();
              }
              
              // Create a fake user ID
              const fakeUserId = `fake-${uuidv4()}`;
              
              // Create match record
              const match = await prisma.match.create({
                data: {
                  userId: user!.id,
                  matchedWith: fakeUserId,
                  isFake: true,
                  videoPath: `/fakeVideos/${randomVideo}`
                }
              });
              
              // Use 5 coins from the user
              const userCoins = await prisma.coin.findUnique({
                where: { userId: user!.id }
              });
              
              if (userCoins) {
                // Update coins
                await prisma.coin.update({
                  where: { userId: user!.id },
                  data: {
                    balance: userCoins.balance - 5
                  }
                });
                
                // Create transaction record
                await prisma.transaction.create({
                  data: {
                    userId: user!.id,
                    amount: 5,
                    type: 'usage',
                    provider: 'system',
                    description: 'Video chat match (fake)'
                  }
                });
              }
              
              // Notify user of the match
              socket.emit('match_found', {
                matchId: match.id,
                userId: fakeUserId,
                isFake: true,
                videoPath: `/fakeVideos/${randomVideo}`
              });
              
              logger.info(`Matched user ${user!.id} with fake video ${randomVideo}`);
            } else {
              // Filter out videos the user has already seen
              const userHistory = userFakeVideoHistory[user!.id] || [];
              let availableVideos = fakeVideos.filter(video => !userHistory.includes(video.id));
              
              // If all videos have been seen, reset history
              if (availableVideos.length === 0) {
                userFakeVideoHistory[user!.id] = [];
                availableVideos = fakeVideos;
              }
              
              // Select a random video
              const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
              
              // Add to user's history
              if (!userFakeVideoHistory[user!.id]) {
                userFakeVideoHistory[user!.id] = [];
              }
              userFakeVideoHistory[user!.id].push(randomVideo.id);
              
              // Create a fake user ID
              const fakeUserId = `fake-${uuidv4()}`;
              
              // Create match record
              const match = await prisma.match.create({
                data: {
                  userId: user!.id,
                  matchedWith: fakeUserId,
                  isFake: true,
                  videoPath: randomVideo.path
                }
              });
              
              // Use 5 coins from the user
              const userCoins = await prisma.coin.findUnique({
                where: { userId: user!.id }
              });
              
              if (userCoins) {
                // Update coins
                await prisma.coin.update({
                  where: { userId: user!.id },
                  data: {
                    balance: userCoins.balance - 5
                  }
                });
                
                // Create transaction record
                await prisma.transaction.create({
                  data: {
                    userId: user!.id,
                    amount: 5,
                    type: 'usage',
                    provider: 'system',
                    description: 'Video chat match (fake)'
                  }
                });
              }
              
              // Notify user of the match
              socket.emit('match_found', {
                matchId: match.id,
                userId: fakeUserId,
                isFake: true,
                videoPath: randomVideo.path
              });
              
              logger.info(`Matched user ${user!.id} with fake video ${randomVideo.path}`);
            }
          }
        }, 3000); // Wait 3 seconds to see if a real match is possible
      }
    });
    
    // Handle cancel find match
    socket.on('cancel_find_match', () => {
      // Remove user from queue
      const userIndex = matchQueue.indexOf(user!.id);
      if (userIndex !== -1) {
        matchQueue.splice(userIndex, 1);
        logger.info(`User ${user!.id} cancelled match finding`);
      }
    });
    
    // Handle end call
    socket.on('end_call', async (data: { matchId: string }) => {
      try {
        // Find the match
        const match = await prisma.match.findUnique({
          where: { id: data.matchId }
        });
        
        if (match) {
          // Calculate duration
          const startTime = match.startTime;
          const endTime = new Date();
          const durationMs = endTime.getTime() - startTime.getTime();
          const durationSeconds = Math.floor(durationMs / 1000);
          
          // Update match record
          await prisma.match.update({
            where: { id: data.matchId },
            data: {
              endTime,
              duration: durationSeconds
            }
          });
          
          logger.info(`Match ${data.matchId} ended. Duration: ${durationSeconds} seconds`);
          
          // If not a fake match, notify the other user
          if (!match.isFake) {
            // Get the other user
            const otherUserId = match.userId === user!.id ? match.matchedWith : match.userId;
            const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
            
            if (otherUser && otherUser.socketId) {
              io.to(otherUser.socketId).emit('call_ended', { matchId: data.matchId });
            }
          }
        }
      } catch (error) {
        logger.error(`Error ending call for match ${data.matchId}:`, error);
      }
    });
    
    // Handle ICE candidates
    socket.on('ice_candidate', (data) => {
      // Forward ICE candidate to the other user
      if (data.to) {
        socket.to(data.to).emit('ice_candidate', data);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      
      // Remove user from match queue
      if (user) {
        const userIndex = matchQueue.indexOf(user.id);
        if (userIndex !== -1) {
          matchQueue.splice(userIndex, 1);
        }
        
        // Update user's last seen time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSeen: new Date() }
        });
      }
    });
  });
};

export default setupSocketHandlers;