import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  category: { type: String, default: 'haircare' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);