import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema({
  percent: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  is_free: { type: Boolean, required: true },
  is_active: { type: Boolean, required: true },
});

const Promo = mongoose.model('Promo', promoSchema);

export default Promo;
