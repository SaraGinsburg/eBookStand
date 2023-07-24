import express from 'express';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { protectRoute, admin } from '../middleware/authMiddleware.js';

const productRoutes = express.Router();

const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

const createProductReview = asyncHandler(async (req, res) => {
  const { title, userId, comment, rating } = req.body;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId);

  if (product) {
    const alreadyReviewed = product.reviews.find((rev) => rev.user.toString() === user._id.toString());
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed.');
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      title,
      user: user._id,
    };

    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review has been saved.' });
  } else {
    res.status(404);
    throw new Error('Product not found.');
  }
});

//create a product
const createNewProduct = asyncHandler(async (req, res) => {
  const { brand, name, category, stock, price, image, productIsNew, description } = req.body;

  const newProduct = await Product.create({
    brand,
    name,
    category,
    stock,
    price,
    image: '/images/' + image,
    productIsNew,
    description,
  });
  await newProduct.save();
  const products = await Product.find({});

  if (newProduct) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error('Product could not be uploaded');
  }
});

//delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found.');
  }
});

//update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { brand, name, category, stock, price, image, productIsNew, description, id } = req.body;

  const product = await Product.findById(id);
  if (product) {
    product.brand = brand;
    product.name = name;
    product.category = category;
    product.stock = stock;
    product.price = price;
    product.image = '/images/' + image;
    product.productIsNew = productIsNew;
    product.description = description;
  }
  const updatedProduct = await product.save();
  if (updatedProduct) {
    const allProducts = await Product.find({});
    res.json(allProducts);
  } else {
    res.status(404);
    throw new Error('Product could not be updated');
  }
});

const removeProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product) {
    const updatedReviews = product.reviews.filter((rev) => rev._id.valueOf() !== req.params.reviewId);
    product.reviews = updatedReviews;
    if (product.reviews.length > 0) {
      product.rating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length;
    } else {
      product.rating = 1;
    }
    await product.save();
    res.status(201).json({ message: 'Review has been removed.' });
  } else {
    res.status(404);
    throw new Error('Product not found.');
  }
});

productRoutes.route('/').get(getProducts);
productRoutes.route('/:id').get(getProduct);
productRoutes.route('/:id/reviews').post(protectRoute, createProductReview);
productRoutes.route('/').post(protectRoute, admin, createNewProduct);
productRoutes.route('/:id').delete(protectRoute, admin, deleteProduct);
productRoutes.route('/').put(protectRoute, admin, updateProduct);
productRoutes.route('/:productId/:reviewId').put(protectRoute, admin, removeProductReview);
export default productRoutes;
