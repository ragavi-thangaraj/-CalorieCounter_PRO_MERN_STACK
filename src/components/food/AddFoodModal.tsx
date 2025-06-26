import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Food } from '../../types';
import { foodAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food | null;
  onFoodAdded: () => void;
}

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  food,
  onFoodAdded
}) => {
  const [quantity, setQuantity] = useState(1);
  const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!food) return;

    setIsLoading(true);
    try {
      await foodAPI.addFoodEntry({
        userId: '', // Will be set by backend from token
        foodId: food._id || food.id,
        food,
        quantity,
        meal,
        date: new Date().toISOString().split('T')[0]
      });
      
      toast.success('Food added successfully!');
      onFoodAdded();
      onClose();
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add food');
    } finally {
      setIsLoading(false);
    }
  };

  if (!food) return null;

  const totalCalories = Math.round(food.calories * quantity);
  const totalProtein = Math.round(food.protein * quantity * 10) / 10;
  const totalCarbs = Math.round(food.carbs * quantity * 10) / 10;
  const totalFat = Math.round(food.fat * quantity * 10) / 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-500 bg-opacity-75"
            aria-hidden="true"
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Food</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">{food.name}</h4>
              <p className="text-sm text-gray-600">{food.servingSize}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal
                </label>
                <select
                  value={meal}
                  onChange={(e) => setMeal(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {mealTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Nutritional Information</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-medium ml-2">{totalCalories}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Protein:</span>
                    <span className="font-medium ml-2">{totalProtein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs:</span>
                    <span className="font-medium ml-2">{totalCarbs}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fat:</span>
                    <span className="font-medium ml-2">{totalFat}g</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || quantity <= 0}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Food
                    </div>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};