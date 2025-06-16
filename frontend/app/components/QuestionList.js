'use client';

import { useState, useEffect } from 'react';
import AnswerForm from './AnswerForm';

export default function QuestionList({ isAdmin = false, isGuest = false }) {
    const [questions, setQuestions] = useState([]);
    const [ws, setWs] = useState(null);

    const sortQuestions = (questionsToSort) => {
        return [...questionsToSort].sort((a, b) => {
            if (a.status === "Escalated" && b.status !== "Escalated") return -1;
            if (a.status !== "Escalated" && b.status === "Escalated") return 1;
            if (a.status === "Answered" && b.status !== "Answered") return 1;
            if (a.status !== "Answered" && b.status === "Answered") return -1;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:8000/questions/');
            const data = await response.json();
            const questionsWithUsernames = data.map(question => ({
                ...question,
                answers: question.answers?.map(answer => ({
                    ...answer,
                    username: answer.username || 'Anonymous'
                }))
            }));
            setQuestions(sortQuestions(questionsWithUsernames));
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();

        let websocket = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const reconnectDelay = 3000; 

        const connectWebSocket = () => {
            try {
                const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${wsProtocol}//${window.location.hostname}:8000/ws`;
                console.log('Attempting to connect to WebSocket at:', wsUrl);
                
                websocket = new WebSocket(wsUrl);
                
                websocket.onopen = () => {
                    console.log('WebSocket Connected Successfully');
                    reconnectAttempts = 0;
                };
                
                websocket.onmessage = (event) => {
                    console.log('WebSocket message received:', event.data);
                    try {
                        const data = JSON.parse(event.data);
                        
                        if (data.type === 'new_question') {
                            setQuestions(prev => {
                                const exists = prev.some(q => q.id === data.question.id);
                                if (exists) {
                                    return prev;
                                }
                                return sortQuestions([data.question, ...prev]);
                            });
                        } else if (data.type === 'question_updated') {
                            setQuestions(prev => {
                                const updatedQuestions = prev.map(q => 
                                    q.id === data.question.id ? data.question : q
                                );
                                return sortQuestions(updatedQuestions);
                            });
                        } else if (data.type === 'new_answer') {
                            setQuestions(prev => {
                                const updatedQuestions = prev.map(q => {
                                    if (q.id === data.answer.question_id) {
                                        const updatedAnswers = [...(q.answers || [])];
                                        const answerExists = updatedAnswers.some(a => a.id === data.answer.id);
                                        if (!answerExists) {
                                            updatedAnswers.push({
                                                ...data.answer,
                                                username: data.answer.username || 'Anonymous'
                                            });
                                        }
                                        return {
                                            ...q,
                                            answers: updatedAnswers
                                        };
                                    }
                                    return q;
                                });
                                return sortQuestions(updatedQuestions);
                            });
                        }
                    } catch (error) {
                        console.error('Error processing WebSocket message:', error);
                    }
                };
                
                websocket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };
                
                websocket.onclose = (event) => {
                    console.log('WebSocket disconnected:', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean
                    });
                    
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
                        setTimeout(connectWebSocket, reconnectDelay);
                    } else {
                        console.error('Max reconnection attempts reached');
                    }
                };
            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
            }
        };

        connectWebSocket();

        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, []); 

    const updateQuestionStatus = async (questionId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found for status update');
                return;
            }

            const response = await fetch(`http://localhost:8000/questions/${questionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update question status');
            }

        } catch (error) {
            console.error('Error updating question status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Answered':
                return 'bg-green-100 text-green-800';
            case 'Escalated':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Questions</h2>
            <div className="space-y-4">
                {questions.map((question) => (
                    <div
                        key={question.id}
                        className="bg-white p-4 rounded-lg shadow-md"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-gray-800">{question.content}</p>
                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(question.status)}`}>
                                {question.status}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                            Posted: {new Date(question.timestamp).toLocaleString()}
                        </div>

                        {/* Answers Section */}
                        {question.answers && question.answers.length > 0 && (
                            <div className="mt-4 space-y-4">
                                <h3 className="text-lg font-semibold">Answers</h3>
                                {question.answers.map((answer) => (
                                    <div key={`${question.id}-${answer.id}`} className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-gray-800">{answer.content}</p>
                                        <div className="text-sm text-gray-500 mt-2">
                                            Answered by: {answer.username === null || answer.username === undefined ? 'Anonymous' : answer.username} • {new Date(answer.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Answer Form */}
                        <AnswerForm 
                            questionId={question.id} 
                            onAnswerSubmitted={() => fetchQuestions()}
                        />

                        {/* Admin Controls */}
                        {isAdmin && (
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => updateQuestionStatus(question.id, 'Escalated')}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Escalate
                                </button>
                                <button
                                    onClick={() => updateQuestionStatus(question.id, 'Answered')}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Mark as Answered
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 