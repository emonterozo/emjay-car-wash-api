import mongoose from 'mongoose';

const priceListSchema = new mongoose.Schema(
  {
    size: { type: String, enum: ['sm', 'md', 'lg', 'xl', 'xxl'], required: true },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    earning_points: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['car', 'motorcycle'], required: true },
  price_list: [priceListSchema],
  image: { type: String, required: true },
  ratings: { type: String, required: true },
  reviews_count: { type: String, required: true },
  last_review: { type: Date, required: false },
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
