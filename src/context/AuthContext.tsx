import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Welcome back!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      await authAPI.signup(email, password, name);
      toast.success('OTP sent to your email. Please verify to complete signup.');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      toast.error(message);
      console.error('Signup error:', error);
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await authAPI.verifyOTP(email, otp);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Account verified successfully!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'OTP verification failed';
      toast.error(message);
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = { ...user, ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(message);
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    verifyOTP,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};