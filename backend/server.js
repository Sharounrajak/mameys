import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import serviceRoutes from './routes/service.routes.js';
import productRoutes from './routes/product.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import academyRoutes from './routes/academy.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend fully running on port ${PORT}`));