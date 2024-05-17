

const Expense = require('../models/expense.model');


exports.createExpense = async (req, res) => {
  try {
    const { description, amount, title, tags } = req.body;
    const newExpense = new Expense({
      title: title,
      description: description,
      amount: amount,
      tags: tags
      
    });

    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().exec();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).exec();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateExpenseById = async (req, res) => {
  try {
    const { description, amount, tags, title } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { description: description, amount: amount, tags: tags, title: title},
      { new: true }
    ).exec();

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteExpenseById = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
