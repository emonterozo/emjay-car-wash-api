import mongoose, { Schema, Document, Types } from 'mongoose';

const serviceSchema = new Schema({
  service_id: { type: Types.ObjectId, ref: 'Service' },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  deduction: { type: Number, required: true },
  company_earnings: { type: Number, required: true },
  employee_share: { type: Number, required: true },
  assigned_employee_id: [{ type: Types.ObjectId, ref: 'Employee' }],
  start_date: { type: Date },
  end_date: { type: Date },
  status: { type: String, enum: ['PENDING', 'ONGOING', 'DONE', 'CANCELLED'], required: true },
  is_free: { type: Boolean, required: true },
  is_paid: { type: Boolean, required: true },
});

const transactionSchema = new mongoose.Schema({
  customer_id: { type: Types.ObjectId, ref: 'Customer' },
  vehicle_type: { type: String, enum: ['car', 'motorcycle'], required: true },
  vehicle_size: { type: String, enum: ['sm', 'md', 'lg', 'xl', 'xxl'], required: true },
  model: { type: String, required: true },
  plate_number: { type: String, required: true },
  contact_number: { type: String },
  check_in: { type: Date, required: true },
  status: { type: String, enum: ['ONGOING', 'COMPLETED', 'CANCELLED'], required: true },
  check_out: { type: Date },
  availed_services: [serviceSchema],
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
