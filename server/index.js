import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import serviceRoutes from './routes/service.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

// Load environment variables from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, '../');
console.log('Loading environment variables from:', path.join(rootPath, '.env'));
dotenv.config({ path: path.join(rootPath, '.env') });

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
