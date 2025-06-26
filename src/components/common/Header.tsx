import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span className="font-medium">{user?.name}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};