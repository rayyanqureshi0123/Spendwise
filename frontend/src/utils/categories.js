// Category config – colors & icons for the 10 expense categories
import {
  MdRestaurant,
  MdFlight,
  MdReceipt,
  MdMovie,
  MdShoppingBag,
  MdLocalHospital,
  MdSchool,
  MdHome,
  MdShoppingCart,
  MdCategory,
} from 'react-icons/md';

const CATEGORIES = {
  Food: { icon: MdRestaurant, color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  Travel: { icon: MdFlight, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  Bills: { icon: MdReceipt, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  Entertainment: { icon: MdMovie, color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  Shopping: { icon: MdShoppingBag, color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  Health: { icon: MdLocalHospital, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  Education: { icon: MdSchool, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  Rent: { icon: MdHome, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  Groceries: { icon: MdShoppingCart, color: '#14b8a6', bg: 'rgba(20,184,166,0.15)' },
  Other: { icon: MdCategory, color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
};

export const CATEGORY_LIST = Object.keys(CATEGORIES);
export default CATEGORIES;
