// routes/expenseRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
require('dotenv').config();
const secret = process.env.JWT_SECRET_KEY;
module.exports.secret = secret;

// const decodeJwt = (req, res, next) => {
//     const token = req.cookies.userToken;

//     if (token) {
//         jwt.verify(token, secret, (err, decoded) => {
//             if (err) {
//                 // Handle JWT verification error
//                 console.error('JWT verification error:', err);
//                 res.status(401).json({ error: 'Unauthorized' });
//             } else {
//                 // Attach decoded user information to the request object
//                 req.user = decoded;
//                 next();
//             }
//         });
//     } else {
//         // No token provided
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// };

// router.use(decodeJwt);

// router.get('/', expenseController.getAllExpensesForCurrentUser);
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpenseById);
router.delete('/:id', expenseController.deleteExpenseById);

module.exports = router;
