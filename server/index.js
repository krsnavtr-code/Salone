import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from the server directory
dotenv.config({ path: '.env' });
import sequelize from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import serviceRoutes from './routes/service.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

// Log all environment variables for debugging
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
});

// Check if JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please check your .env file');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.send('Salon API is running'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    console.log('Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    console.log(`Starting server on port ${PORT}`);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

// Start server
console.log('Starting server...');
startServer();
