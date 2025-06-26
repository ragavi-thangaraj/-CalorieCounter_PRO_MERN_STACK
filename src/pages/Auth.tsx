import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { OTPVerification } from '../components/auth/OTPVerification';

export const Auth: React.FC = () => {
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>(
    location.pathname === '/signup' ? 'signup' : 'login'
  );
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [location.pathname]);

  const handleOTPRequired = (email: string) => {
    setPendingEmail(email);
    setMode('otp');
  };

  const handleBackToSignup = () => {
    setMode('signup');
    setPendingEmail('');
  };

  if (mode === 'otp') {
    return <OTPVerification email={pendingEmail} onBack={handleBackToSignup} />;
  }

  if (mode === 'signup') {
    return <SignupForm onOTPRequired={handleOTPRequired} />;
  }

  return <LoginForm />;
};