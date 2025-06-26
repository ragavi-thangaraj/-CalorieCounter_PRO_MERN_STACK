import axios from 'axios';
import { User, Food, FoodEntry, Exercise, ExerciseEntry, WeightEntry, DailyStats } from '../types';

// Use local backend for development by default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection.';
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    } else if (!error.response) {
      error.message = 'Network error. Please check if the backend server is running.';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }).then(res => res.data),
  
  verifyOTP: (email: string, otp: string) =>
    api.post('/auth/verify-otp', { email, otp }).then(res => res.data),
  
  updateProfile: (userData: Partial<User>) =>
    api.put('/auth/profile', userData).then(res => res.data),
};

// Food API
export const foodAPI = {
  searchFoods: (query: string) =>
    api.get<Food[]>(`/foods/search?q=${query}`).then(res => res.data),
  
  getFoodById: (id: string) =>
    api.get<Food>(`/foods/${id}`).then(res => res.data),
  
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt'>) =>
    api.post<FoodEntry>('/foods/entries', entry).then(res => res.data),
  
  getFoodEntries: (date: string) =>
    api.get<FoodEntry[]>(`/foods/entries?date=${date}`).then(res => res.data),
  
  updateFoodEntry: (id: string, entry: Partial<FoodEntry>) =>
    api.put<FoodEntry>(`/foods/entries/${id}`, entry).then(res => res.data),
  
  deleteFoodEntry: (id: string) =>
    api.delete(`/foods/entries/${id}`).then(res => res.data),
};

// Exercise API
export type AddExerciseEntryPayload = {
  exerciseId: string;
  exercise: Exercise;
  duration: number;
  caloriesBurned: number;
  date: string;
};

export const exerciseAPI = {
  searchExercises: (query: string) =>
    api.get<Exercise[]>(`/exercises/search?q=${query}`).then(res => res.data),
  
  addExerciseEntry: (entry: AddExerciseEntryPayload) =>
    api.post<ExerciseEntry>('/exercises/entries', entry).then(res => res.data),
  
  getExerciseEntries: (date: string) =>
    api.get<ExerciseEntry[]>(`/exercises/entries?date=${date}`).then(res => res.data),
  
  deleteExerciseEntry: (id: string) =>
    api.delete(`/exercises/entries/${id}`).then(res => res.data),
};

// Weight API
export const weightAPI = {
  addWeightEntry: (weight: number, date: string) =>
    api.post<WeightEntry>('/weight', { weight, date }).then(res => res.data),
  
  getWeightEntries: (days: number = 30) =>
    api.get<WeightEntry[]>(`/weight?days=${days}`).then(res => res.data),
};

// Stats API
export const statsAPI = {
  getDailyStats: (date: string) =>
    api.get<DailyStats>(`/stats/daily?date=${date}`).then(res => res.data),
  
  getWeeklyStats: (startDate: string) =>
    api.get<DailyStats[]>(`/stats/weekly?startDate=${startDate}`).then(res => res.data),
};