import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'eSewa', 'Khalti'], default: 'COD' },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  orderStatus: { type: String, enum: ['PROCESSING', 'COMPLETED', 'CANCELLED'], default: 'PROCESSING' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);