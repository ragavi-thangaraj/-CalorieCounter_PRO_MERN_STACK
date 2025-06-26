import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || 0,
    height: user?.height || 0,
    weight: user?.weight || 0,
    activityLevel: user?.activityLevel || 'moderate',
    goal: user?.goal || 'maintain',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'dailyCalorieGoal' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (intense exercise daily)' }
  ];

  const goals = [
    { value: 'lose', label: 'Lose Weight' },
    { value: 'maintain', label: 'Maintain Weight' },
    { value: 'gain', label: 'Gain Weight' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and fitness goals</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <User className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </motion.button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {goals.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  name="dailyCalorieGoal"
                  value={formData.dailyCalorieGoal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-lg font-semibold text-gray-900">{user?.age || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Height</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.height ? `${user.height} cm` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.weight ? `${user.weight} kg` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Activity Level</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {user?.activityLevel?.replace('_', ' ') || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Goal</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {user?.goal ? `${user.goal} Weight` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Calorie Goal</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.dailyCalorieGoal || 2000} calories
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">BMI</h3>
          <p className="text-2xl font-bold text-emerald-600">
            {user?.height && user?.weight 
              ? ((user.weight / Math.pow(user.height / 100, 2)).toFixed(1))
              : '--'
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Days Active</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Member Since</h3>
          <p className="text-lg font-bold text-orange-600">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};