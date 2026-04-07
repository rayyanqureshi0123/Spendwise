import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';
import {
  MdDashboard,
  MdReceiptLong,
  MdBarChart,
  MdLogout,
  MdAccountBalanceWallet,
  MdLightMode,
  MdDarkMode,
} from 'react-icons/md';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/expenses', label: 'Expenses', icon: MdReceiptLong },
  { to: '/analytics', label: 'Analytics', icon: MdBarChart },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (!isDark) {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isDark]);

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass sticky top-0 z-50 mx-3 sm:mx-5 mt-3 px-4 sm:px-6 py-2.5"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <MdAccountBalanceWallet className="text-white text-base" />
            </div>
            <span className="text-lg font-bold gradient-text tracking-tight hidden sm:block">SpendWise</span>
          </div>

          {/* Nav links – hidden on mobile */}
          <div className="hidden md:flex items-center gap-0.5 bg-surface-900/50 rounded-xl p-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/25 text-primary-300 shadow-sm'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.03]'
                  }`
                }
              >
                <Icon className="text-base" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-surface-900/40 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-surface-300 font-medium max-w-[120px] truncate">{user?.name}</span>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors cursor-pointer"
            >
              {isDark ? <MdLightMode className="text-lg" /> : <MdDarkMode className="text-lg" />}
            </button>

            <button
              onClick={() => setIsLogoutOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-surface-400 hover:text-danger-400 hover:bg-danger-500/8 transition-all duration-200 cursor-pointer"
            >
              <MdLogout className="text-base" />
              <span className="hidden sm:inline text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="glass border-t border-white/[0.04] flex justify-around items-center py-1.5 px-2" style={{borderRadius: 0}}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-medium transition-all duration-200 ${
                  isActive ? 'text-primary-400 bg-primary-500/10' : 'text-surface-500'
                }`
              }
            >
              <Icon className="text-lg" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmColor="bg-danger-500 hover:bg-danger-600"
      />
    </>
  );
};

export default Navbar;
