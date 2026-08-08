import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Get all active salon services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new service (For testing / Admin)
router.post('/', async (req, res) => {
  try {
    const newService = new Service(req.body);
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;