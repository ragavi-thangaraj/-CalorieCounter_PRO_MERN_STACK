import React, { useEffect, useState } from 'react';
import { statsAPI, weightAPI } from '../services/api';
import { WeightEntry, DailyStats } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Progress = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const weights = await weightAPI.getWeightEntries(30);
      const stats = await statsAPI.getDailyStats(today);
      setWeightEntries(weights);
      setDailyStats(stats);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Prepare data for chart
  const chartData = weightEntries.map(entry => ({ date: entry.date, weight: entry.weight }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Progress</h2>
      {loading ? <div>Loading...</div> : (
        <>
          {/* Weight Chart */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold mb-2">Weight (last 30 days)</h3>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 text-center py-8">Not enough data to show chart.</div>
            )}
          </div>

          {/* Stats Cards */}
          {dailyStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl p-6 shadow flex flex-col items-center">
                <div className="text-lg font-semibold mb-1">Calories Consumed</div>
                <div className="text-2xl font-bold">{dailyStats.totalCaloriesConsumed}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl p-6 shadow flex flex-col items-center">
                <div className="text-lg font-semibold mb-1">Calories Burned</div>
                <div className="text-2xl font-bold">{dailyStats.totalCaloriesBurned}</div>
              </div>
              <div className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white rounded-xl p-6 shadow flex flex-col items-center">
                <div className="text-lg font-semibold mb-1">Net Calories</div>
                <div className="text-2xl font-bold">{dailyStats.netCalories}</div>
              </div>
            </div>
          )}

          {/* Today's Stats */}
          {dailyStats && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold mb-2">Today's Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-500 text-xs">Protein</div>
                  <div className="font-bold">{dailyStats.protein}g</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Carbs</div>
                  <div className="font-bold">{dailyStats.carbs}g</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Fat</div>
                  <div className="font-bold">{dailyStats.fat}g</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Fiber</div>
                  <div className="font-bold">{dailyStats.fiber}g</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Progress; 