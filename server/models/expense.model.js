const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },

    description: {
        type: String,
    },

    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        validate: {
            validator: function(value) {
                return value !== 0;
            },
            message: 'Amount cannot be 0'
        },
        
    },
    tags: { 
        type: String, 
        default: 'General',
        required: [true, 'Tags is required']
    }
}, { timestamps: true })

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;