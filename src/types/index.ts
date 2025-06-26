export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  dailyCalorieGoal: number;
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  category: string;
  _id?: string;
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: string;
  _id?: string;
}

export interface Exercise {
  id: string;
  name: string;
  caloriesPerMinute: number;
  category: string;
  _id?: string;
}

export interface ExerciseEntry {
  id: string;
  userId: string;
  exerciseId: string;
  exercise: Exercise;
  duration: number;
  caloriesBurned: number;
  date: string;
  createdAt: string;
  _id?: string;
}

export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
}

export interface DailyStats {
  date: string;
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
  netCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterIntake: number;
}