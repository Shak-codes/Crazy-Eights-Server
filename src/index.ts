// src/index.ts
import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { AppDataSource } from './data-source';  // Import the new DataSource
import routes from './route';


const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/api', routes);

// HTTP server for Express and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('playCard', (data) => {
    const { roomId, move } = data;
    io.to(roomId).emit('movePlayed', move);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize the DataSource (replacement for createConnection)
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
