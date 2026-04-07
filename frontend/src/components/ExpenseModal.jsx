import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_LIST } from '../utils/categories';
import CATEGORIES from '../utils/categories';
import { MdClose, MdSave } from 'react-icons/md';

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Sync form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Other',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setForm({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '' });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[90vh]"
            style={{ background: '#0d1526', border: '1px solid rgba(148,163,184,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-surface-700" />
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto scrollbar-none flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Expense' : 'New Expense'}</h2>
                  <p className="text-xs text-surface-500 mt-0.5">{isEdit ? 'Update the details below' : 'Fill in the details below'}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-surface-800 flex items-center justify-center text-surface-500 hover:text-white transition-colors cursor-pointer"
                >
                  <MdClose />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Lunch at café"
                    className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder-surface-600 transition-all
                      bg-surface-900/80 border ${errors.title ? 'border-danger-500/50' : 'border-white/[0.06]'}`}
                  />
                  {errors.title && <p className="text-danger-400 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Amount & Date row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">
                      Amount (₹)
                    </label>
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="0"
                      className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder-surface-600 transition-all
                        bg-surface-900/80 border ${errors.amount ? 'border-danger-500/50' : 'border-white/[0.06]'}`}
                    />
                    {errors.amount && <p className="text-danger-400 text-xs mt-1">{errors.amount}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">
                      Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl text-sm text-white transition-all
                        bg-surface-900/80 border ${errors.date ? 'border-danger-500/50' : 'border-white/[0.06]'}`}
                    />
                    {errors.date && <p className="text-danger-400 text-xs mt-1">{errors.date}</p>}
                  </div>
                </div>

                {/* Category Grid */}
                <div>
                  <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {CATEGORY_LIST.map((cat) => {
                      const { icon: Icon, color, bg } = CATEGORIES[cat];
                      const isSelected = form.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, category: cat }))}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] transition-all cursor-pointer"
                          style={{
                            background: isSelected ? bg : 'rgba(15,23,42,0.5)',
                            border: `1px solid ${isSelected ? color + '50' : 'rgba(255,255,255,0.04)'}`,
                            color: isSelected ? color : '#475569',
                          }}
                        >
                          <Icon className="text-lg" />
                          <span className="truncate w-full text-center leading-tight">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Notes input for "Other" category */}
                {form.category === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5 mt-4">
                      Specify Category (Optional)
                    </label>
                    <input
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="e.g. Pet supplies"
                      className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder-surface-600 transition-all
                        bg-surface-900/80 border border-white/[0.06] focus:border-primary-500`}
                    />
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/20 cursor-pointer mt-1"
                >
                  <MdSave />
                  {isEdit ? 'Update Expense' : 'Add Expense'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;
