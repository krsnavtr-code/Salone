import express from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Appointment from '../models/appointment.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    console.log('=== verifyAdmin Middleware ===');
    console.log('Authorization header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', JSON.stringify(decoded, null, 2));
    
    const user = await User.findByPk(decoded.id);
    console.log('User found:', user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin' || user.role === 'superadmin'
    } : 'User not found');

    if (!user) {
      console.log('User not found in database');
      return res.status(403).json({ message: 'User not found' });
    }

    // Check if user has admin or superadmin role
    const adminRoles = ['admin', 'superadmin'];
    if (!adminRoles.includes(user.role)) {
      console.log('User does not have admin role, actual role:', user.role);
      return res.status(403).json({ 
        message: 'Admin access required',
        userRole: user.role,
        userId: user.id
      });
    }

    console.log('User is admin, proceeding...');
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in verifyAdmin middleware:', error);
    res.status(401).json({ 
      message: 'Invalid token',
      error: error.message 
    });
  }
};

// Get dashboard statistics
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    // Get total appointments
    const totalAppointments = await Appointment.count();
    
    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.count({
      where: {
        date: {
          [Op.between]: [today, tomorrow]
        }
      }
    });

    // Get total services
    const totalServices = await Service.count();

    // Get total users
    const totalUsers = await User.count();

    // Get upcoming appointments for the next 7 days
    const upcomingAppointments = await Appointment.findAll({
      where: {
        date: {
          [Op.gt]: new Date(),
          [Op.lt]: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: ['date'],
      group: ['date'],
      order: [['date', 'ASC']]
    });

    const stats = {
      totalAppointments,
      todayAppointments,
      totalServices,
      totalUsers,
      upcomingAppointments: upcomingAppointments.map(appointment => ({
        date: appointment.date,
        count: 1
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Services Management
router.get('/services', verifyAdmin, async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

router.post('/services', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, duration, isActive } = req.body;
    const service = await Service.create({
      name,
      description,
      price,
      duration,
      isActive
    });
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Failed to create service' });
  }
});

router.put('/services/:id', verifyAdmin, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.update(req.body);
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Failed to update service' });
  }
});

router.delete('/services/:id', verifyAdmin, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

// Users Management
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.put('/users/:id/role', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ role: req.body.role });
    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// Appointments Management
router.get('/appointments', verifyAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email', 'phone']
        },
        {
          model: Service,
          attributes: ['name', 'price', 'duration']
        }
      ],
      order: [['date', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    console.error('Appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

router.put('/appointments/:id/status', verifyAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.update({ status: req.body.status });
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
});

export default router;
