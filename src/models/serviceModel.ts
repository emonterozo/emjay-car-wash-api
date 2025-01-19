import mongoose from 'mongoose';

const priceListSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 0,
  },
});

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  price_list: [priceListSchema],
  image: { type: String, required: true },
  ratings: { type: String, required: true },
  reviews_count: { type: String, required: true },
  last_review: { type: Date, required: false },
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
