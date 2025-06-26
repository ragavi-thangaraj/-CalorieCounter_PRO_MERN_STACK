import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Food } from '../../types';
import { foodAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface FoodSearchProps {
  onFoodSelect: (food: Food) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onFoodSelect }) => {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchFoods = async () => {
      if (query.length < 2) {
        setFoods([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await foodAPI.searchFoods(query);
        setFoods(results);
      } catch (error) {
        toast.error('Failed to search foods');
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchFoods, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Foods</h3>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for foods..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {foods.map((food) => (
          <motion.div
            key={food._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: foods.indexOf(food) * 0.05 }}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{food.name}</h4>
              <p className="text-sm text-gray-600">
                {food.calories} cal per {food.servingSize}
              </p>
              <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                <span>P: {food.protein}g</span>
                <span>C: {food.carbs}g</span>
                <span>F: {food.fat}g</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFoodSelect(food)}
              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {query.length >= 2 && !isLoading && foods.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No foods found for "{query}"
        </div>
      )}
    </div>
  );
};