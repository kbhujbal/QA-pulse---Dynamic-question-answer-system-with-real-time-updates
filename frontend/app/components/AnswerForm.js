'use client';

import { useState, useEffect } from 'react';

export default function AnswerForm({ questionId, onAnswerSubmitted }) {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSuggestions();
    }, [questionId]);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`http://localhost:8000/questions/${questionId}/suggestions`);
            if (!response.ok) throw new Error('Failed to fetch suggestions');
            const data = await response.json();
            setSuggestions(data.suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`http://localhost:8000/questions/${questionId}/answers`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ content: answer }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit answer');
            }

            setAnswer('');
            if (onAnswerSubmitted) {
                onAnswerSubmitted();
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const useSuggestion = (suggestion) => {
        setAnswer(suggestion);
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                        Your Answer
                    </label>
                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={4}
                        required
                    />
                </div>
                
                {suggestions.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Answers:</h4>
                        <div className="space-y-2">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm text-gray-600">{suggestion.answer}</p>
                                    {suggestion.approach && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Approach: {suggestion.approach}
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => useSuggestion(suggestion.answer)}
                                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        Use this suggestion
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? 'Submitting...' : 'Submit Answer'}
                </button>
            </form>
        </div>
    );
} 