import mongoose from 'mongoose';

const academyClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  durationDays: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  registrationLink: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('AcademyClass', academyClassSchema);