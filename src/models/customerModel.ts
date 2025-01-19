import mongoose from 'mongoose';

const washServiceCountSchema = new mongoose.Schema({
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

const customerSchema = new mongoose.Schema({
  first_name: { type: String, required: true, unique: true },
  last_name: { type: String, required: true },
  gender: { type: String, required: true },
  birth_date: { type: String, required: true },
  contact_number: { type: String, required: true },
  password: { type: String, required: true },
  province: { type: String, required: true },
  barangay: { type: String, required: true },
  address: { type: String, required: true },
  registered_on: { type: String, required: true },
  car_wash_service_count: [washServiceCountSchema],
  moto_wash_service_count: [washServiceCountSchema],
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
