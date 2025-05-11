import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'node:http';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables
dotenv.config();

// Import routes and socket manager
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import coinRoutes from './routes/coins.js';
import matchRoutes from './routes/matches.js';
import adminRoutes from './routes/admin.js';
import setupSocketHandlers from './sockets/socketManager.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Get current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: process.env.NODE_ENV !== 'production',
  path: '/peerjs'
});

// Set up middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static files directory for fake videos
const publicDir = resolve(__dirname, '../public');
app.use('/fakeVideos', express.static(join(publicDir, 'fakeVideos')));

// Set up PeerJS server
app.use('/peerjs', peerServer);

// Set up routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/coins', coinRoutes);
app.use('/matches', matchRoutes);
app.use('/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// Set up Socket.IO event handlers
setupSocketHandlers(io);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default server;