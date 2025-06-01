const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
};

exports.addExpense = async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.status(201).json(expense);
};

exports.deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
