import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect, adminGuard } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1. GET /api/appointments/booked-slots?date=YYYY-MM-DD
// Public route to check availability
router.get('/booked-slots', async (req, res, next) => {
  const { date } = req.query;
  try {
    const appointments = await Appointment.find({ 
      appointmentDate: date, 
      status: { $ne: 'CANCELLED' } 
    }).select('timeSlot');
    
    const bookedSlots = appointments.map(app => app.timeSlot);
    res.json(bookedSlots);
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/appointments
// Public route to book a new appointment
router.post('/', async (req, res, next) => {
  try {
    const { customerName, customerPhone, service, appointmentDate, timeSlot } = req.body;

    const existing = await Appointment.findOne({ 
      appointmentDate, 
      timeSlot, 
      status: { $ne: 'CANCELLED' } 
    });

    if (existing) {
      return res.status(400).json({ message: 'This slot is already booked!' });
    }

    const appointment = await Appointment.create({
      customerName,
      customerPhone,
      service,
      appointmentDate,
      timeSlot
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/appointments
// Admin route to view all bookings
router.get('/', protect, adminGuard, async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate('service').sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

// 4. PUT /api/appointments/:id/status
// Admin route to update booking status
router.put('/:id/status', protect, adminGuard, async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// This is the line that was missing!
export default router;