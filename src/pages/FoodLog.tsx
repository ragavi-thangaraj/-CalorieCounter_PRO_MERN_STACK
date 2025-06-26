import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Plus } from 'lucide-react';
import { FoodSearch } from '../components/food/FoodSearch';
import { AddFoodModal } from '../components/food/AddFoodModal';
import { Food, FoodEntry } from '../types';
import { foodAPI } from '../services/api';
import { format } from 'date-fns';

export const FoodLog: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'search'>('log');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFoodEntries();
  }, [selectedDate]);

  const fetchFoodEntries = async () => {
    setIsLoading(true);
    try {
      const entries = await foodAPI.getFoodEntries(selectedDate);
      setFoodEntries(entries);
    } catch (error) {
      console.error('Failed to fetch food entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleFoodAdded = () => {
    fetchFoodEntries();
    setActiveTab('log');
  };

  const groupedEntries = foodEntries.reduce((acc, entry) => {
    if (!acc[entry.meal]) {
      acc[entry.meal] = [];
    }
    acc[entry.meal].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  const mealTotals = Object.entries(groupedEntries).reduce((acc, [meal, entries]) => {
    acc[meal] = entries.reduce((total, entry) => total + (entry.food.calories * entry.quantity), 0);
    return acc;
  }, {} as Record<string, number>);

  const totalCalories = Object.values(mealTotals).reduce((sum, calories) => sum + calories, 0);

  const mealLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
          <p className="text-gray-600">Track your daily nutrition</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {format(new Date(selectedDate), 'EEEE, MMMM d')}
            </h2>
            <p className="text-emerald-100">Total calories consumed</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{totalCalories}</p>
            <p className="text-emerald-100">calories</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'log'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Log</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search Foods</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'log' ? (
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            Object.entries(mealLabels).map(([mealKey, mealLabel]) => {
              const entries = groupedEntries[mealKey] || [];
              const mealCalories = mealTotals[mealKey] || 0;

              return (
                <motion.div
                  key={mealKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{mealLabel}</h3>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{mealCalories}</p>
                      <p className="text-sm text-gray-600">calories</p>
                    </div>
                  </div>

                  {entries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No foods logged for {mealLabel.toLowerCase()}</p>
                      <button
                        onClick={() => setActiveTab('search')}
                        className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Add foods
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {entries.map((entry) => (
                        <div key={entry._id || entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{entry.food.name}</h4>
                            <p className="text-sm text-gray-600">
                              {entry.quantity} × {entry.food.servingSize}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {Math.round(entry.food.calories * entry.quantity)} cal
                            </p>
                            <div className="text-xs text-gray-500 space-x-2">
                              <span>P: {Math.round(entry.food.protein * entry.quantity)}g</span>
                              <span>C: {Math.round(entry.food.carbs * entry.quantity)}g</span>
                              <span>F: {Math.round(entry.food.fat * entry.quantity)}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        <FoodSearch onFoodSelect={handleFoodSelect} />
      )}

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        food={selectedFood}
        onFoodAdded={handleFoodAdded}
      />
    </div>
  );
};