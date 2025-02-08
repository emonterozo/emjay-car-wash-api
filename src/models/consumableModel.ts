import mongoose from 'mongoose';

const consumableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Consumable = mongoose.model('Consumable', consumableSchema);

export default Consumable;
