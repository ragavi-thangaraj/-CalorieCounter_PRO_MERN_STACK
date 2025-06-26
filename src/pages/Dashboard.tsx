import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, TrendingUp, Award } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { CalorieChart } from '../components/dashboard/CalorieChart';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../services/api';
import { DailyStats } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const stats = await statsAPI.getDailyStats(todayStr);
        setDailyStats(stats);

        // Fetch real weekly stats from API
        const startDate = new Date();
        startDate.setDate(today.getDate() - 6);
        const startDateStr = startDate.toISOString().split('T')[0];
        const weeklyStats = await statsAPI.getWeeklyStats(startDateStr);
        // Map API response to chart format
        const chartData = weeklyStats.map((stat: any) => ({
          date: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
          consumed: stat.totalCaloriesConsumed,
          burned: stat.totalCaloriesBurned,
          goal: user?.dailyCalorieGoal || 2000
        }));
        setWeeklyData(chartData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const caloriesRemaining = (user?.dailyCalorieGoal || 2000) - (dailyStats?.netCalories || 0);
  const progressPercentage = Math.min(
    ((dailyStats?.totalCaloriesConsumed || 0) / (user?.dailyCalorieGoal || 2000)) * 100,
    100
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white p-6"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-emerald-100">
          You've consumed {dailyStats?.totalCaloriesConsumed || 0} calories today
        </p>
        <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Daily Goal Progress</span>
            <span className="text-sm font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Calories Today"
          value={dailyStats?.totalCaloriesConsumed || 0}
          subtitle={`${caloriesRemaining} remaining`}
          icon={Flame}
          color="emerald"
        />
        <StatsCard
          title="Calories Burned"
          value={dailyStats?.totalCaloriesBurned || 0}
          subtitle="from exercise"
          icon={TrendingUp}
          color="orange"
        />
        <StatsCard
          title="Net Calories"
          value={dailyStats?.netCalories || 0}
          subtitle="consumed - burned"
          icon={Target}
          color="blue"
        />
        <StatsCard
          title="Daily Goal"
          value={user?.dailyCalorieGoal || 2000}
          subtitle="target calories"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <CalorieChart data={weeklyData} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Nutrition Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">P</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailyStats?.protein || 0}g</p>
            <p className="text-sm text-gray-600">Protein</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">C</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailyStats?.carbs || 0}g</p>
            <p className="text-sm text-gray-600">Carbohydrates</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">F</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailyStats?.fat || 0}g</p>
            <p className="text-sm text-gray-600">Fat</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};