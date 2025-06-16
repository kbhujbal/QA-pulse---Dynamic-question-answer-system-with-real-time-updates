'use client';

import { useState } from 'react';
import SignUp from './SignUp';
import Login from './Login';

export default function AuthWrapper({ onAuthSuccess }) {
    const [authMode, setAuthMode] = useState('choice'); 

    const handleSignUpSuccess = (data) => {
        if (onAuthSuccess) onAuthSuccess(data);
    };

    const handleLoginSuccess = (data) => {
        if (onAuthSuccess) onAuthSuccess(data);
    };

    const handleGuestMode = () => {
        if (onAuthSuccess) onAuthSuccess({ isGuest: true });
    };

    if (authMode === 'signup') {
        return <SignUp onSuccess={handleSignUpSuccess} />;
    }

    if (authMode === 'login') {
        return <Login onSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Q&A Dashboard</h2>
            <div className="space-y-4">
                <button
                    onClick={() => setAuthMode('signup')}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign Up
                </button>
                <button
                    onClick={() => setAuthMode('login')}
                    className="w-full bg-white text-indigo-600 py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Login
                </button>
                <button
                    onClick={handleGuestMode}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
} 