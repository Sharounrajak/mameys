import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminGuard } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/orders - Customer checkout
router.post('/', async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerAddress, items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalAmount = 0;
    const itemsToSave = [];

    // Process each item & check stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      // Deduct inventory stock
      product.stockQuantity -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      itemsToSave.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerAddress,
      items: itemsToSave,
      totalAmount,
      paymentMethod
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders - Admin route to view all orders
router.get('/', protect, adminGuard, async (req, res, next) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id/status - Admin route to update status
router.put('/:id/status', protect, adminGuard, async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;