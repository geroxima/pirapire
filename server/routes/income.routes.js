const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
require('dotenv').config();
const secret = process.env.JWT_SECRET_KEY;
module.exports.secret = secret;

//  const decodeJwt = (req, res, next) => {
//      const token = req.cookies.userToken;

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

// router.get('/', incomeController.getAllIncomesForCurrentUser);
router.post('/', incomeController.createIncome);
router.get('/', incomeController.getAllIncomes);
router.get('/:id', incomeController.getIncomeById);
router.put('/:id', incomeController.updateIncomeById);
router.delete('/:id', incomeController.deleteIncomeById);

module.exports = router;