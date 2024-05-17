const Income = require('../models/income.model');

exports.createIncome = async (req, res) => {
    try {
        const { description, amount, tags, title } = req.body;

        const newIncome = new Income({
            title: title,
            tags: tags,
            description: description,
            amount: amount,
        });

        const savedIncome = await newIncome.save();
        res.json(savedIncome);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getAllIncomesForCurrentUser = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: userId }).exec();
        res.json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.find().exec();
        res.json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getIncomeById = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id).populate('userId').exec();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updateIncomeById = async (req, res) => {
    try {
        const { description, amount, tags } = req.body;
        const updatedIconme = await Income.findByIdAndUpdate(req.params.id, {description: description, amount: amount, tags: tags}, 
        {new: true}).exec();
        res.json(updatedIconme)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteIncomeById = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id).exec();
        res.json({ message: 'Income deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
