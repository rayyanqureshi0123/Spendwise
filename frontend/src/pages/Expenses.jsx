import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getExpensesAPI, addExpenseAPI, updateExpenseAPI, deleteExpenseAPI } from '../api/expenses';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseModal from '../components/ExpenseModal';
import ConfirmDialog from '../components/ConfirmDialog';
import CustomDropdown from '../components/CustomDropdown';
import CATEGORIES, { CATEGORY_LIST } from '../utils/categories';
import { formatCurrency, MONTH_NAMES_FULL } from '../utils/helpers';
import { MdAdd, MdSearchOff, MdFilterList, MdSearch } from 'react-icons/md';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [filter, filterMonth, filterYear]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'All') params.category = filter;

      if (filterMonth !== 'All' || filterYear !== 'All') {
        const y = filterYear !== 'All' ? parseInt(filterYear) : new Date().getFullYear();
        let mStart = 0;
        let mEnd = 11;

        if (filterMonth !== 'All') {
          mStart = parseInt(filterMonth);
          mEnd = mStart;
        }

        params.startDate = new Date(y, mStart, 1).toISOString();
        params.endDate = new Date(y, mEnd + 1, 0, 23, 59, 59).toISOString();
      }

      const { data } = await getExpensesAPI(params);
      setExpenses(data.data);
    } catch {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpenseAPI(editingExpense._id, formData);
        toast.success('Expense updated');
      } else {
        await addExpenseAPI(formData);
        toast.success('Expense added');
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExpenseAPI(deleteId);
      toast.success('Expense deleted');
      setExpenses((prev) => prev.filter((exp) => exp._id !== deleteId));
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const openAddModal = () => { setEditingExpense(null); setIsModalOpen(true); };
  const openEditModal = (exp) => { setEditingExpense(exp); setIsModalOpen(true); };

  // Filter by search query on frontend
  const lowerQuery = searchQuery.trim().toLowerCase();
  const filteredExpenses = expenses.filter(exp => 
    (exp.title && exp.title.toLowerCase().includes(lowerQuery)) ||
    (exp.notes && exp.notes.toLowerCase().includes(lowerQuery)) ||
    (exp.category && exp.category.toLowerCase().includes(lowerQuery))
  );

  // Total of filtered
  const total = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <div className="space-y-5 page-enter">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Expenses</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              {filter === 'All' ? 'All transactions' : `${filter} category`}
              {!loading && <> · <span className="text-surface-400 font-medium">{filteredExpenses.length} entries · {formatCurrency(total)}</span></>}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto gap-3">
            {/* Filters Group */}
            <div className="flex items-center justify-between sm:justify-start gap-1 bg-surface-900/50 border border-white/[0.05] rounded-xl px-2 py-1 overflow-visible w-full sm:w-auto">
              {/* Category filter */}
              <div className="border-r border-white/10 pr-1 shrink-0 relative">
                <CustomDropdown
                  value={filter}
                  onChange={setFilter}
                  icon={MdFilterList}
                  options={[
                    { value: 'All', label: 'All Categories' },
                    ...CATEGORY_LIST.map(c => ({ value: c, label: c }))
                  ]}
                />
              </div>

              {/* Month filter */}
              <div className="border-r border-white/10 px-1 shrink-0 relative">
                <CustomDropdown
                  value={filterMonth}
                  onChange={setFilterMonth}
                  options={[
                    { value: 'All', label: 'All Months' },
                    ...MONTH_NAMES_FULL.map((m, i) => ({ value: i, label: m }))
                  ]}
                />
              </div>

              {/* Year filter */}
              <div className="pl-1 shrink-0 relative">
                <CustomDropdown
                  value={filterYear}
                  onChange={setFilterYear}
                  options={[
                    { value: 'All', label: 'All Years' },
                    ...Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i).map(y => ({ value: y, label: String(y) }))
                  ]}
                />
              </div>
            </div>

            {/* Add button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAddModal}
              className="flex items-center justify-center sm:justify-start gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary-500/20 cursor-pointer w-full sm:w-auto"
            >
              <MdAdd className="text-lg" />
              <span>Add Expense</span>
            </motion.button>
          </div>
        </div>

        {/* Category quick-filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...CATEGORY_LIST].map((cat) => {
            const isActive = filter === cat;
            const catConfig = cat !== 'All' ? CATEGORIES[cat] : null;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0"
                style={{
                  background: isActive
                    ? (catConfig ? catConfig.bg : 'rgba(99,102,241,0.2)')
                    : 'rgba(30,41,59,0.5)',
                  color: isActive
                    ? (catConfig ? catConfig.color : '#a5b4fc')
                    : '#64748b',
                  border: isActive
                    ? `1px solid ${catConfig ? catConfig.color + '60' : 'rgba(99,102,241,0.4)'}`
                    : '1px solid transparent',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative mb-2">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
          <input
            type="text"
            placeholder="Search expenses by title, category, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-900/50 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-primary-500/50 focus:bg-surface-800/80 transition-all font-medium shadow-sm outline-none"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-7 h-7 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass flex flex-col items-center justify-center py-24 text-center rounded-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-900/60 flex items-center justify-center mb-4">
              <MdSearchOff className="text-3xl text-surface-600" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No expenses found</h3>
            <p className="text-sm text-surface-500 max-w-xs mb-6">
              {filter !== 'All'
                ? `No "${filter}" expenses recorded yet.`
                : 'Get started by adding your first expense.'}
            </p>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              <MdAdd /> Add your first expense
            </button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredExpenses.map((expense, index) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  index={index}
                  onEdit={openEditModal}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals outside the transformed container */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
        onSubmit={handleAddEdit}
        initialData={editingExpense}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="This will permanently delete this expense. Are you sure?"
      />
    </>
  );
};

export default Expenses;
