import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getExpensesAPI, getMonthlySummaryAPI, getCategorySummaryAPI } from '../api/expenses';
import { formatCurrency, getMonthName } from '../utils/helpers';
import StatCard from '../components/StatCard';
import CATEGORIES from '../utils/categories';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet, MdReceipt, MdCalendarToday, MdLightbulbOutline } from 'react-icons/md';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const PIE_COLORS = ['#818cf8', '#34d399', '#f97316', '#ec4899', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6', '#64748b'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-4 py-2.5 text-sm shadow-xl">
      <p className="text-surface-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [monthRes, catRes, expRes] = await Promise.all([
        getMonthlySummaryAPI(),
        getCategorySummaryAPI(),
        getExpensesAPI(),
      ]);

      const formatted = monthRes.data.data.map((item) => ({
        name: `${getMonthName(item._id.month)} ${item._id.year}`,
        month: getMonthName(item._id.month),
        amount: item.totalAmount,
      }));
      setMonthlyData(formatted);

      setCategoryData(
        catRes.data.data.map((item, i) => ({
          name: item._id,
          value: item.totalAmount,
          color: CATEGORIES[item._id]?.color || PIE_COLORS[i % PIE_COLORS.length],
        }))
      );

      setRecentExpenses(expRes.data.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalThisMonth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].amount : 0;
  const totalLastMonth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2].amount : 0;
  const totalAll = categoryData.reduce((s, c) => s + c.value, 0);
  const expenseCount = recentExpenses.length;

  let pctChange = 0;
  if (totalLastMonth > 0) pctChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;

  const getInsight = () => {
    if (categoryData.length === 0) return "Add your first expense to start receiving smart insights!";
    
    // Recent giant expense
    if (recentExpenses.length > 0 && recentExpenses[0].amount > 5000) {
      return `You recently dropped ${formatCurrency(recentExpenses[0].amount)} on ${recentExpenses[0].title}.`;
    }
    
    // Huge increase over last month
    if (totalLastMonth > 0 && totalThisMonth > totalLastMonth * 1.5) {
      return `Careful! Your spending this month is growing much faster than last month.`;
    }

    // Top category heavy spending
    if (topCategory && totalAll > 0) {
      const topPct = ((topCategory.value / totalAll) * 100).toFixed(0);
      if (topPct > 40) {
        return `${topCategory.name} is eating up ${topPct}% of your overall spending!`;
      }
      return `You've spent mostly on ${topCategory.name} recently (${formatCurrency(topCategory.value)}).`;
    }

    return "You're consistently tracking your finances. Keep up the great work!";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 page-enter">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-surface-500 mt-0.5">Here's your spending overview</p>
      </div>

      {/* Smart Insight Banner */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 px-4 py-3 rounded-xl"
        >
          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
            <MdLightbulbOutline className="text-primary-400 text-lg" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wide mb-0.5">Smart Insight</p>
            <p className="text-sm text-surface-200">{getInsight()}</p>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={MdAccountBalanceWallet}
          label="This Month"
          value={formatCurrency(totalThisMonth)}
          color="#34d399"
          index={0}
        />
        <StatCard
          icon={pctChange > 0 ? MdTrendingUp : MdTrendingDown}
          label="vs Last Month"
          value={
            <span className={pctChange > 0 ? 'text-danger-400' : pctChange < 0 ? 'text-accent-400' : 'text-white'}>
              {pctChange > 0 ? '+' : ''}{pctChange.toFixed(1)}%
            </span>
          }
          subtitle={pctChange > 0 ? 'Spending increased' : pctChange < 0 ? 'Spending decreased' : 'No change'}
          color="#60a5fa"
          index={1}
        />
        <StatCard
          icon={MdReceipt}
          label="Total Tracked"
          value={formatCurrency(totalAll)}
          subtitle="All time"
          color="#a78bfa"
          index={2}
        />
        <StatCard
          icon={MdCalendarToday}
          label="Top Category"
          value={topCategory ? topCategory.name : 'N/A'}
          subtitle={topCategory ? formatCurrency(topCategory.value) : ''}
          color="#f97316"
          index={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Monthly Spending Area Chart – takes 3/5 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass glow-card p-5 lg:col-span-3"
        >
          <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-5">Monthly Spending</h2>
          <div className="h-[280px] sm:h-[320px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
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
                    tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`}
                    dx={-5}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#818cf8"
                    strokeWidth={2.5}
                    fill="url(#grad)"
                    dot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Add expenses to see your spending trend" />
            )}
          </div>
        </motion.div>

        {/* Category Pie + Legend – takes 2/5 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass glow-card p-5 lg:col-span-2"
        >
          <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-5">Spending by Category</h2>
          <div className="h-[200px] sm:h-[220px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, i) => (
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
              <EmptyState message="No categories yet" />
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
            {categoryData.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-surface-400">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto font-medium text-surface-300">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass glow-card p-5"
      >
        <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4">Recent Transactions</h2>
        {recentExpenses.length > 0 ? (
          <div className="space-y-2">
            {recentExpenses.map((exp, i) => {
              const cat = CATEGORIES[exp.category] || CATEGORIES.Other;
              const CatIcon = cat.icon;
              return (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.bg }}>
                    <CatIcon style={{ color: cat.color }} className="text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{exp.title}</p>
                    <p className="text-[11px] text-surface-500">{exp.category} · {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <p className="text-sm font-semibold text-white shrink-0">-{formatCurrency(exp.amount)}</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No transactions recorded yet" />
        )}
      </motion.div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex items-center justify-center h-full text-surface-500 text-sm">
    {message}
  </div>
);

export default Dashboard;
