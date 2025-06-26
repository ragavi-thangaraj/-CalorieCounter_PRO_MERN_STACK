import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'orange' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorMap = {
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[color]} shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};