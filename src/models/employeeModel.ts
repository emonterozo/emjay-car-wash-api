import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE'], required: true },
  birth_date: { type: Date, required: true },
  contact_number: { type: String, required: true },
  employee_title: { type: String, required: true },
  employee_status: {
    type: String,
    enum: ['ACTIVE', 'TERMINATED'],
    required: true,
  },
  date_started: { type: Date, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
