import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    id: 'add-food',
    title: 'Log Food',
    description: 'Add meals to your diary',
    icon: Plus,
    color: 'emerald',
    path: '/food'
  },
  {
    id: 'search-food',
    title: 'Search Foods',
    description: 'Find nutritional info',
    icon: Search,
    color: 'blue',
    path: '/food?tab=search'
  },
  {
    id: 'add-exercise',
    title: 'Log Exercise',
    description: 'Track your workouts',
    icon: Calendar,
    color: 'orange',
    path: '/exercise'
  },
  {
    id: 'set-goals',
    title: 'Update Goals',
    description: 'Adjust your targets',
    icon: Target,
    color: 'purple',
    path: '/profile'
  }
];

const colorMap = {
  emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
  blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
};

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className={`p-4 rounded-lg text-left transition-all duration-200 bg-gradient-to-r ${colorMap[action.color as keyof typeof colorMap]} text-white shadow-sm`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <div>
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};