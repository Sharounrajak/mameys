import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order & reduce stock
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, orderItems, totalAmount, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in the order' });
    }

    // 1. Reduce stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // Ensure stock doesn't go negative
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        await product.save();
      }
    }

    // 2. Create the order
    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      orderItems,
      totalAmount,
      paymentMethod
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the status
    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};