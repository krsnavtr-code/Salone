import express from 'express';
import Appointment from '../models/appointment.model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.user.id
      }
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { service_id, appointment_date } = req.body;
  try {
    const appointment = await Appointment.create({
      user_id: req.user.id,
      service_id,
      appointment_date,
      status: 'pending'
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
