import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { signupAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { MdPerson, MdEmail, MdLock, MdAccountBalanceWallet, MdArrowForward } from 'react-icons/md';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const { data } = await signupAPI(form);
      if (data.success) {
        login(data.user, data.token);
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-surface-950">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-600 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '11s' }} />
        </div>

        <div className="relative z-10 w-full max-w-lg px-12">
          {/* Abstract floating elements */}
          <div className="relative h-64 mb-12">
            {/* Main glass circular element */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-12 w-48 h-48 rounded-full border border-white/10 glass shadow-2xl flex items-center justify-center z-20"
            >
              <div className="w-32 h-32 rounded-full border border-dashed border-primary-500/50 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-4 h-4 bg-primary-400 rounded-full absolute -top-2 left-14 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              </div>
              <MdAccountBalanceWallet className="text-white text-4xl absolute" />
            </motion.div>

            {/* Background floating glass card */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute bottom-4 left-4 w-56 h-32 glass rounded-2xl p-4 shadow-xl border border-white/5 opacity-80 z-10"
            >
              <div className="flex gap-2 items-end h-full pt-4">
                <div className="w-1/4 bg-primary-500/40 rounded-sm h-[40%]" />
                <div className="w-1/4 bg-primary-400/60 rounded-sm h-[70%]" />
                <div className="w-1/4 bg-accent-400/80 rounded-sm h-[100%]" />
                <div className="w-1/4 bg-accent-500 rounded-sm h-[85%]" />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Begin Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">
                Financial Journey
              </span>
            </h2>
            <p className="text-surface-400 text-lg leading-relaxed max-w-sm">
              Discover unparalleled insights into your spending patterns. Secure, intuitive, and built for your peace of mind.
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

          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-surface-500 mb-8">Start tracking your expenses in seconds</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative flex items-center">
                <MdPerson className="absolute left-3.5 text-surface-500 text-lg" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-900/60 border border-white/[0.06] text-white placeholder-surface-600 text-sm transition-all"
                />
              </div>
            </div>

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
                  placeholder="Min 8 characters"
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
                <>Create Account <MdArrowForward /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
