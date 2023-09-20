const Expense = require('../models/expenses');

exports.insertExp = async (req, res) => {
    const { expense, description, category } = req.body;
    const { name, _id: userId } = req.user;
    
    const newExpense = new Expense({
        expense,
        description,
        category,
        user: {
            name,
            userId,
        },
    });
    try {
        const savedExpense = await newExpense.save();

        return res.status(201).json({ expense: savedExpense, success: true });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ success: false, error: err });
    }
};

exports.getAllExp = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 3;

        const expenses = await Expense.find({
            'user.userId': req.user._id
        })    
            .limit(perPage)
            .skip((page - 1) * perPage);
        
        
        const totalExpenses = await Expense.countDocuments({
            'user.userId': req.user._id, 
        });
        const totalPages = Math.ceil(totalExpenses / perPage);

        res.status(200).json({
            expenses,
            totalExpenses,
            totalPages,
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching expenses.');
    }
};


exports.deleteExp = async (req, res) => {
    const expenseId = req.params.id; 
    try {
        if (!expenseId) {
            res.status(404).send('Expense not found.');
            return;
        }
        await Expense.findByIdAndRemove(expenseId);
        res.status(200).send('Expense deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting expense.');
    }
};
