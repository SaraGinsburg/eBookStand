import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import { admin, protectRoute } from '../middleware/authMiddleware.js';

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

const getOrders = async (req, res) => {
  const orders = await Order.find({});
  if (orders) {
    res.json(orders);
  }
};

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('This order could not be found');
  }
});

const setDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order could not be updated.');
  }
});

orderRoutes.route('/').post(protectRoute, createOrder);
orderRoutes.route('/:id').delete(protectRoute, admin, deleteOrder);
orderRoutes.route('/:id').put(protectRoute, admin, setDelivered);
orderRoutes.route('/').get(protectRoute, admin, getOrders);

export default orderRoutes;

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
