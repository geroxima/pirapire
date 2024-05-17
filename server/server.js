require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookierParser = require("cookie-parser");
const app = express();
const port = 8000;
require("./config/mongo.config");

app.use(cookierParser());

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"]
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

const sessionRoutes = require('./routes/session.routes');
app.use('/api/session', sessionRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const expenseRoutes = require('./routes/expense.routes');
app.use('/api/expenses', expenseRoutes);

const incomeRoutes = require('./routes/income.routes');
app.use('/api/incomes', incomeRoutes);

app.get('/hello', (req, res) => {
    res.json('Hello World');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})