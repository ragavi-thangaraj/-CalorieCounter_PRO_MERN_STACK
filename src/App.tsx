import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { FoodLog } from './pages/FoodLog';
import { Profile } from './pages/Profile';
import Exercise from './pages/Exercise';
import Progress from './pages/Progress';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="CalorieCounter Pro" />
      <div className="flex">
        <Navigation />
        <main className="flex-1 ml-64 p-6 pt-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      ) : (
        <>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/food" element={
            <ProtectedRoute>
              <FoodLog />
            </ProtectedRoute>
          } />
          <Route path="/exercise" element={
            <ProtectedRoute>
              <Exercise />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;