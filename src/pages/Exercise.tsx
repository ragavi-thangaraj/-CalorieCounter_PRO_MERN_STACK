import React, { useState, useEffect } from 'react';
import { exerciseAPI } from '../services/api';
import type { Exercise } from '../types';
import { ExerciseEntry } from '../types';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';

const Exercise = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchEntries();
  }, [date]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await exerciseAPI.getExerciseEntries(date);
      setEntries(res);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await exerciseAPI.searchExercises(query);
      setSearchResults(res);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (exercise: Exercise) => {
    if (!duration) return;
    setLoading(true);
    try {
      await exerciseAPI.addExerciseEntry({
        exerciseId: (exercise as any)._id || exercise.id,
        exercise,
        duration: Number(duration),
        caloriesBurned: exercise.caloriesPerMinute * Number(duration),
        date
      });
      setDuration('');
      setQuery('');
      setSearchResults([]);
      fetchEntries();
    } catch (error) {
      toast.error('Failed to add exercise entry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await exerciseAPI.deleteExerciseEntry(id);
      fetchEntries();
    } finally {
      setLoading(false);
    }
  };

  // Calculate total calories burned
  const totalCaloriesBurned = entries.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Exercise Log</h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white p-6 flex items-center justify-between shadow">
        <div>
          <div className="text-lg font-semibold mb-1">Total Calories Burned</div>
          <div className="text-3xl font-bold">{totalCaloriesBurned}</div>
        </div>
        <div className="text-right">
          <div className="text-emerald-100">{date}</div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exercise..." className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow">Search</button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Results:</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {searchResults.map(ex => (
              <div key={ex._id || ex.id} className="bg-white rounded-lg shadow flex items-center gap-4 p-4 border border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{ex.name}</div>
                  <div className="text-xs text-gray-500">{ex.category} • {ex.caloriesPerMinute} cal/min</div>
                </div>
                <input type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" className="border p-1 rounded w-24" />
                <button onClick={() => handleAdd(ex)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow">Add</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entries */}
      <div>
        <h3 className="font-semibold mb-2">Your Exercise Entries</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No exercise entries for this day.</div>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry._id || entry.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">{entry.exercise.name}</div>
                  <div className="text-xs text-gray-500">{entry.duration} min • {entry.caloriesBurned} cal</div>
                </div>
                <button onClick={() => handleDelete(entry._id || entry.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise; 