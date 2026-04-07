import { motion } from 'framer-motion';
import CATEGORIES from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/helpers';
import { MdEdit, MdDelete } from 'react-icons/md';

const ExpenseCard = ({ expense, onEdit, onDelete, index = 0 }) => {
  const cat = CATEGORIES[expense.category] || CATEGORIES.Other;
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      layout
      className="glass-light flex items-center gap-3 sm:gap-4 p-3 sm:p-4 group hover:border-white/[0.1] transition-all duration-200"
    >
      {/* Category Icon */}
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: cat.bg }}
      >
        <Icon className="text-lg sm:text-xl" style={{ color: cat.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">{expense.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: cat.bg, color: cat.color }}
          >
            {expense.category}{expense.notes ? ` · ${expense.notes}` : ''}
          </span>
          <span className="text-[10px] sm:text-xs text-surface-500">{formatDate(expense.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-white">{formatCurrency(expense.amount)}</p>
      </div>

      {/* Actions – visible on hover (desktop) always on mobile */}
      <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(expense)}
          className="p-1.5 rounded-lg hover:bg-primary-500/15 text-surface-500 hover:text-primary-400 transition-colors cursor-pointer"
        >
          <MdEdit className="text-base" />
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="p-1.5 rounded-lg hover:bg-danger-500/15 text-surface-500 hover:text-danger-400 transition-colors cursor-pointer"
        >
          <MdDelete className="text-base" />
        </button>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;
