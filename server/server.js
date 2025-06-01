const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/expenses', expenseRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/expense-tracker')
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch(err => console.error(err));
