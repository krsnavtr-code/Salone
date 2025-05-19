const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Service, Appointment, User, Offer, Settings } = require('../models');

// Services Management
router.get('/services', [auth, admin], async (req, res) => {
  try {
    const services = await Service.find().select('-__v');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/services', [auth, admin], async (req, res) => {
  try {
    const service = new Service({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
    });
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/services/:id', [auth, admin], async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        duration: req.body.duration,
      },
      { new: true }
    );
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/services/:id', [auth, admin], async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Appointments Management
router.get('/appointments', [auth, admin], async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name')
      .populate('serviceId', 'name')
      .select('-__v');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/appointments/:id/status', [auth, admin], async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/appointments/:id', [auth, admin], async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User Management
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', [auth, admin], async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/role', [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', [auth, admin], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Offers Management
router.get('/offers', [auth, admin], async (req, res) => {
  try {
    const offers = await Offer.find().populate('services').select('-__v');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/offers', [auth, admin], async (req, res) => {
  try {
    const offer = new Offer({
      title: req.body.title,
      description: req.body.description,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      services: req.body.services,
      status: req.body.status,
    });
    await offer.save();
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/offers/:id/status', [auth, admin], async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/offers/:id', [auth, admin], async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings Management
router.get('/settings', [auth, admin], async (req, res) => {
  try {
    const settings = await Settings.findOne().select('-__v');
    if (!settings) {
      const defaultSettings = new Settings({
        name: 'Beauty Salon',
        address: '123 Beauty Street',
        phone: '+1 234 567 890',
        email: 'info@beautysalon.com',
      });
      await defaultSettings.save();
      res.json(defaultSettings);
    } else {
      res.json(settings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', [auth, admin], async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics
router.get('/analytics', [auth, admin], async (req, res) => {
  try {
    // Get data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get appointments and revenue data
    const appointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo },
          status: { $in: ['confirmed', 'completed'] },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service',
        },
      },
      {
        $unwind: '$service',
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          appointments: { $sum: 1 },
          revenue: { $sum: '$service.price' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          appointments: 1,
          revenue: 1,
        },
      },
    ]);

    // Get service performance data
    const servicePerformance = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo },
          status: { $in: ['confirmed', 'completed'] },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service',
        },
      },
      {
        $unwind: '$service',
      },
      {
        $group: {
          _id: '$service.name',
          totalAppointments: { $sum: 1 },
          totalRevenue: { $sum: '$service.price' },
        },
      },
      {
        $project: {
          _id: 0,
          service: '$_id',
          totalAppointments: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json({ appointments, servicePerformance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
