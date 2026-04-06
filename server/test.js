import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import Expense from './models/Expense.js';

dotenv.config();

async function testModels() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: '123456'
    });

    const savedUser = await user.save();
    console.log('User saved:', savedUser);

    const expense = new Expense({
      userId: savedUser._id,
      title: 'Pizza',
      amount: 200,
      category: 'Food'
    });

    const savedExpense = await expense.save();
    console.log('Expense saved:', savedExpense);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testModels();