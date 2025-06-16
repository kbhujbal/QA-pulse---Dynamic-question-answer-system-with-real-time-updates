'use client';

import { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import AuthWrapper from './components/auth/AuthWrapper';

export default function Home() {
  const [authState, setAuthState] = useState(null);

  const handleAuthSuccess = (data) => {
    setAuthState(data);
  };

  if (!authState) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AuthWrapper onAuthSuccess={handleAuthSuccess} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Q&A Dashboard</h1>
          <div className="flex items-center space-x-4">
            {!authState.isGuest && (
              <span className="text-sm text-gray-600">
                Logged in as: {authState.email || authState.username}
              </span>
            )}
            <button
              onClick={() => setAuthState(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              {authState.isGuest ? 'Switch to Account' : 'Logout'}
            </button>
          </div>
        </div>
        
        <QuestionForm />
        <div className="mt-8">
          <QuestionList 
            isAdmin={!authState.isGuest} 
            isGuest={authState.isGuest}
          />
        </div>
      </div>
    </main>
  );
}
