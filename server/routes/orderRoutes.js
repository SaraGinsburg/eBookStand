import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import protectRoute from '../middleware/authMiddleware.js';

const orderRoutes = express.Router();

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, paymentDetails, shippingPrice, totalPrice, paidAt, userInfo } =
    req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order Items.');
  } else {
    const order = new Order({
      orderItems,
      user: userInfo._id,
      username: userInfo.name,
      email: userInfo.email,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      shippingPrice,
      shippingAddress,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
  try {
  } catch (error) {}
});

// const getOrders = async (req, res) => {
//   const orders = await Order.find({});
//   res.json(orders);
// };

// const getOrder = async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// };
// orderRoutes.route('/').get(getOrders);
// orderRoutes.route('/:id').get(getOrder);

orderRoutes.route('/').post(protectRoute, createOrder);

export default orderRoutes;
