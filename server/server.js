import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

console.log('Starting server...');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expense.js';

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('SpendWise API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected');
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });