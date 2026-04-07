import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: [
      'Food',
      'Travel',
      'Bills',
      'Entertainment',
      'Shopping',
      'Health',
      'Education',
      'Rent',
      'Groceries',
      'Other'
    ],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

expenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);