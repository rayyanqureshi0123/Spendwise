import Expense from '../models/Expense.js';


// ➕ ADD EXPENSE
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    const expense = new Expense({
      userId: req.user._id,
      title,
      amount,
      category,
      date,
      notes
    });

    const savedExpense = await expense.save();

    res.status(201).json({
      success: true,
      data: savedExpense
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// 📥 GET ALL EXPENSES
export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    let filter = {
      userId: req.user._id
    };

    // 🔍 Category filter
    if (category) {
      filter.category = category;
    }

    // 📅 Date filter
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.json({
      success: true,
      data: expenses
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ✏️ UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // 🔐 check ownership
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { title, amount, category, date, notes } = req.body;

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    if (notes !== undefined) expense.notes = notes;

    const updated = await expense.save();

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ❌ DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // 🔐 check ownership
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense deleted'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getYearlySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id
        }
      },
      {
        $group: {
          _id: { $year: "$date" },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};  

export const getCategorySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};