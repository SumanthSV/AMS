import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import departmentRoutes from './routes/department.routes.js';
import shiftRoutes from './routes/shift.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import configRoutes from './routes/config.routes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/config', configRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AMS-SM24E API' });
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle check-in event
  socket.on('check-in', (data) => {
    console.log('Check-in event:', data);
    // Broadcast check-in to all connected clients
    io.emit('attendance-update', { 
      type: 'check-in', 
      employeeId: data.employeeId,
      timestamp: new Date()
    });
  });

  // Handle check-out event
  socket.on('check-out', (data) => {
    console.log('Check-out event:', data);
    // Broadcast check-out to all connected clients
    io.emit('attendance-update', { 
      type: 'check-out', 
      employeeId: data.employeeId,
      timestamp: new Date()
    });
  });

  // Handle leave-request event
  socket.on('leave-request', (data) => {
    console.log('Leave request event:', data);
    // Broadcast to admin clients
    io.emit('leave-update', { 
      type: 'new-request', 
      employeeId: data.employeeId,
      requestId: data.requestId,
      timestamp: new Date()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;