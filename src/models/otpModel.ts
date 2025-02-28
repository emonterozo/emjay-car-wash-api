import mongoose, { Types } from 'mongoose';

const otpSchema = new mongoose.Schema({
  customer_id: { type: Types.ObjectId, ref: 'Customer' },
  otp: { type: Number, required: true },
  created_at: { type: Date, default: Date.now, expires: 300 },
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
