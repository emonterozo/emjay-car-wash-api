import mongoose, { Types } from 'mongoose';

const otpSchema = new mongoose.Schema({
  customer_id: { type: Types.ObjectId, ref: 'Customer' },
  otp: { type: Number, required: true },
  created_at: { type: Date, default: Date.now, expires: 290 },
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
