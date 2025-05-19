import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import serviceRoutes from './routes/service.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.send('Salon API is running 🚀'));

// MySQL & server start
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL Database connected successfully');
    sequelize.sync({ alter: true })
      .then(() => {
        console.log('Database tables synchronized');
        app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
      })
      .catch((err) => console.error('Error syncing database:', err));
  })
  .catch((err) => console.error('Error connecting to database:', err));
