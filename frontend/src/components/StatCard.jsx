import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, subtitle, color, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass glow-card p-5 hover:border-white/[0.08] transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="text-xl" style={{ color }} />
        </div>
      </div>
      <p className="text-[11px] text-surface-500 font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-surface-400 mt-1">{subtitle}</p>}
    </motion.div>
  );
};

export default StatCard;
