import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { loginAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdAccountBalanceWallet, MdArrowForward } from 'react-icons/md';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      if (data.success) {
        login(data.user, data.token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-surface-950">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-500 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        <div className="relative z-10 w-full max-w-lg px-12">
          {/* Abstract floating elements */}
          <div className="relative h-64 mb-12">
            {/* Main glass card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute top-4 right-8 w-64 h-36 glass rounded-2xl p-5 shadow-2xl border border-white/10 z-20"
            >
              <div className="flex gap-3 items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center">
                  <MdAccountBalanceWallet className="text-primary-400 text-xl" />
                </div>
                <div>
                  <div className="h-2 w-16 bg-surface-700 rounded-full mb-2"></div>
                  <div className="h-2 w-24 bg-surface-800 rounded-full"></div>
                </div>
              </div>
              <div className="h-3 w-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-3" />
              <div className="flex justify-between">
                <div className="h-2 w-12 bg-surface-700 rounded-full"></div>
                <div className="h-2 w-12 bg-surface-800 rounded-full"></div>
              </div>
            </motion.div>

            {/* Background floating card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute bottom-0 left-4 w-48 h-48 bg-gradient-to-br from-surface-800 to-surface-900 rounded-3xl p-5 shadow-xl border border-white/5 opacity-80 z-10"
            >
              <div className="h-full border border-dashed border-surface-600 rounded-xl flex items-center justify-center">
                <MdArrowForward className="text-surface-500 text-3xl rotate-[-45deg]" />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Wealth Ecosystem
              </span>
            </h2>
            <p className="text-surface-400 text-lg leading-relaxed max-w-sm">
              An intelligent, beautiful way to track every penny, uncover spending habits, and secure your financial future.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel – Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <MdAccountBalanceWallet className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">SpendWise</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-surface-500 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative flex items-center">
                <MdEmail className="absolute left-3.5 text-surface-500 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-900/60 border border-white/[0.06] text-white placeholder-surface-600 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-3.5 text-surface-500 text-lg" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-900/60 border border-white/[0.06] text-white placeholder-surface-600 text-sm transition-all"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <MdArrowForward /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
