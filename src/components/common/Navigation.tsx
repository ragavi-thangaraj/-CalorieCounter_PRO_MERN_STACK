import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, TrendingUp, User, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/food', icon: Calendar, label: 'Food Log' },
  { to: '/exercise', icon: Dumbbell, label: 'Exercise' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen fixed left-0 top-16 z-10">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 w-full"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};