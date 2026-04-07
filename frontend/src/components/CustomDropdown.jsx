import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdExpandMore } from 'react-icons/md';

const CustomDropdown = ({ value, onChange, options, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => String(o.value) === String(value))?.label || value;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-surface-300 hover:text-white transition-colors py-1 px-1 sm:px-2 rounded-lg cursor-pointer outline-none"
      >
        {Icon && <Icon className="text-surface-500 text-base" />}
        <span className="font-medium whitespace-nowrap">{selectedLabel}</span>
        <MdExpandMore className={`text-surface-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-[140px] glass border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ background: '#0f172a' }}
          >
            <div className="max-h-60 overflow-y-auto scrollbar-none py-1">
              {options.map((opt) => {
                const isSelected = String(value) === String(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                      ${
                        isSelected
                          ? 'bg-primary-500/20 text-primary-400 font-semibold'
                          : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                      }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
