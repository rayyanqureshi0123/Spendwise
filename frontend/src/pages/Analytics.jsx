import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  getMonthlySummaryAPI,
  getYearlySummaryAPI,
  getCategorySummaryAPI,
} from '../api/expenses';
import { formatCurrency, getMonthNameFull, getMonthName } from '../utils/helpers';
import CATEGORIES from '../utils/categories';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
  AreaChart, Area,
  LineChart, Line,
} from 'recharts';

const CHART_COLORS = ['#818cf8', '#34d399', '#f97316', '#ec4899', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6', '#64748b'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-4 py-3 shadow-xl text-sm">
      <p className="text-surface-400 text-xs font-medium mb-1">{label}</p>
      <p className="text-white font-bold text-base">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

const Analytics = () => {
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [mRes, yRes, cRes] = await Promise.all([
        getMonthlySummaryAPI(),
        getYearlySummaryAPI(),
        getCategorySummaryAPI(),
      ]);

      // Monthly: "January", "February", etc
      setMonthly(
        mRes.data.data.map((d) => ({
          name: getMonthNameFull(d._id.month),
          shortName: getMonthName(d._id.month),
          year: d._id.year,
          fullLabel: `${getMonthNameFull(d._id.month)} ${d._id.year}`,
          amount: d.totalAmount,
        }))
      );

      // Yearly: "2023", "2024", etc
      setYearly(
        yRes.data.data.map((d) => ({
          name: String(d._id),
          amount: d.totalAmount,
        }))
      );

      // Category
      setCategory(
        cRes.data.data.map((d, i) => ({
          name: d._id,
          value: d.totalAmount,
          color: CATEGORIES[d._id]?.color || CHART_COLORS[i % CHART_COLORS.length],
        }))
      );
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const totalAllTime = category.reduce((s, c) => s + c.value, 0);
  const avgMonthly = monthly.length > 0 ? totalAllTime / monthly.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
    { id: 'category', label: 'Category' },
  ];

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-surface-500 mt-0.5">Deep dive into your spending patterns</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-0.5 p-1 bg-surface-900/60 rounded-xl border border-white/[0.04]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'text-surface-500 hover:text-surface-300 hover:bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass p-4">
          <p className="text-[10px] text-surface-500 uppercase tracking-widest font-semibold">Total (All Time)</p>
          <p className="text-lg sm:text-xl font-bold gradient-text mt-1">{formatCurrency(totalAllTime)}</p>
        </div>
        <div className="glass p-4">
          <p className="text-[10px] text-surface-500 uppercase tracking-widest font-semibold">Monthly Avg</p>
          <p className="text-lg sm:text-xl font-bold gradient-text-green mt-1">{formatCurrency(avgMonthly)}</p>
        </div>
        <div className="glass p-4 hidden sm:block">
          <p className="text-[10px] text-surface-500 uppercase tracking-widest font-semibold">Categories Used</p>
          <p className="text-lg sm:text-xl font-bold text-white mt-1">{category.length}</p>
        </div>
      </div>

      {/* ─── MONTHLY ─── */}
      <AnimatePresence mode="wait">
        {activeTab === 'monthly' && (
          <motion.div
            key="monthly"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass glow-card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
                Monthly Expense Breakdown
              </h2>
              <span className="text-xs text-surface-500">{monthly.length} months</span>
            </div>
            <div className="h-[300px] sm:h-[400px]">
              {monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                    <XAxis
                      dataKey="shortName"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {monthly.map((entry, i) => (
                        <Cell key={i} fill={`hsl(${235 + i * 8}, 70%, ${65 - i * 2}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
            {/* Monthly breakdown table */}
            {monthly.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {monthly.map((m, i) => (
                  <motion.div
                    key={m.fullLabel}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-surface-900/40 rounded-lg px-3 py-2 text-center border border-white/[0.03]"
                  >
                    <p className="text-[10px] text-surface-500 font-medium">{m.shortName} {m.year}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{formatCurrency(m.amount)}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── YEARLY ─── */}
        {activeTab === 'yearly' && (
          <motion.div
            key="yearly"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass glow-card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
                Yearly Expense Overview
              </h2>
              <span className="text-xs text-surface-500">{yearly.length} years</span>
            </div>
            <div className="h-[300px] sm:h-[400px]">
              {yearly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearly} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#475569"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={64}>
                      {yearly.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
            {/* Yearly cards */}
            {yearly.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {yearly.map((y, i) => (
                  <motion.div
                    key={y.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-surface-900/40 rounded-xl px-4 py-3 border border-white/[0.04]"
                  >
                    <p className="text-xs text-surface-500 font-semibold tracking-wide">{y.name}</p>
                    <p className="text-lg font-bold text-white mt-1">{formatCurrency(y.amount)}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── CATEGORY ─── */}
        {activeTab === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* Donut Chart */}
            <div className="glass glow-card p-5">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-5">
                Category Distribution
              </h2>
              <div className="h-[260px] sm:h-[320px]">
                {category.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={category}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {category.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px' }}
                        itemStyle={{ color: '#fff', fontSize: '13px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </div>
            </div>

            {/* Category Breakdown List */}
            <div className="glass glow-card p-5">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-5">
                Detailed Breakdown
              </h2>
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {category.map((item, i) => {
                  const cat = CATEGORIES[item.name] || CATEGORIES.Other;
                  const Icon = cat.icon;
                  const pct = totalAllTime > 0 ? ((item.value / totalAllTime) * 100).toFixed(1) : 0;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: cat.bg }}
                      >
                        <Icon className="text-lg" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-white">{item.name}</span>
                          <span className="text-sm font-bold text-white ml-2">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </div>
                        <p className="text-[10px] text-surface-500 mt-1 font-medium">{pct}% of total spending</p>
                      </div>
                    </motion.div>
                  );
                })}
                {category.length === 0 && <EmptyChart />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-full text-surface-500">
    <p className="text-sm">No data available yet</p>
    <p className="text-xs mt-1 text-surface-600">Start adding expenses to see analytics</p>
  </div>
);

export default Analytics;
