import express from 'express';
import AcademyClass from '../models/AcademyClass.js';
import { protect, adminGuard } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/academy - Public route to view upcoming classes
router.get('/', async (req, res, next) => {
  try {
    const classes = await AcademyClass.find({ isActive: true }).sort({ startDate: 1 });
    res.json(classes);
  } catch (error) {
    next(error);
  }
});

// POST /api/academy - Admin route to create a class
router.post('/', protect, adminGuard, async (req, res, next) => {
  try {
    const newClass = await AcademyClass.create(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
});

export default router;