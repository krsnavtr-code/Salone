import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import serviceRoutes from './service.routes.js';
import appointmentRoutes from './appointment.routes.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Service routes
router.use('/services', serviceRoutes);

// Appointment routes
router.use('/appointments', appointmentRoutes);

export default router;
