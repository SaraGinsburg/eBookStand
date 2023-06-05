import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    publisher: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numberOfReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    productIsNew: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
