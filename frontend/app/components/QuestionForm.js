'use client';

import { useState } from 'react';

export default function QuestionForm() {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!question.trim()) {
            setError('Question cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/questions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: question }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to submit question');
            }

            setQuestion('');
            setError('');
        } catch (err) {
            setError('Failed to submit question. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4">
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Ask a Question
                </label>
                <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder="Type your question here..."
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Submit Question
            </button>
        </form>
    );
} 