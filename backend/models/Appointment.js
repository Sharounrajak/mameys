import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  service: { type: String, ref: 'Service', required: true },
  appointmentDate: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true },       // e.g. "10:00 AM"
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);