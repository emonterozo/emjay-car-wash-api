import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['MANPOWER', 'ELECTRICITY', 'RENT', 'CONSUMABLES', 'OTHERS'],
    required: true,
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
