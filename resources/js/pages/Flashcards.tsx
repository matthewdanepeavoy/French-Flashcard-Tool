import React, { useState } from 'react';
import { PageProps } from '@inertiajs/core';

type Question = {
    id: number;
    english: string;
    french: string;
};

interface Props extends PageProps {
    questions: Question[];
}

export default function Flashcards({ questions }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState<Record<number, { tries: number; correct: boolean }>>({});

    const currentQuestion = questions[currentIndex];

    const checkAnswer = () => {
        const correctPhrase = currentQuestion.french.trim();
        const userAnswer = answer.trim();

        const correctWords = correctPhrase.toLowerCase().split(/\s+/);
        const userWords = userAnswer.toLowerCase().split(/\s+/);

        let correctCount = 0;
        const wordResults = correctWords.map((word, i) => {
            if (userWords[i] && userWords[i] === word) {
                correctCount++;
                return { word: userWords[i], correct: true };
            } else {
                return { word: userWords[i] || '', correct: false, expected: word };
            }
        });

        const accuracy = Math.round((correctCount / correctWords.length) * 100);
        const isExact = userAnswer.toLowerCase() === correctPhrase.toLowerCase();

        setFeedback({ isExact, accuracy, wordResults });

        setAttempts(prev => ({
            ...prev,
            [currentQuestion.id]: {
                correct: isExact,
                tries: (prev[currentQuestion.id]?.tries || 0) + 1
            }
        }));

        if (isExact) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        setAnswer('');
        setCurrentIndex(prev => (prev + 1) % questions.length);
    };

    const getWordStyle = (wordObj: any) => {
        if (wordObj.correct) return { color: 'green' };
        return { color: 'red', cursor: 'pointer', textDecoration: 'underline' };
    };

    const handleWordClick = (wordObj: any) => {
        if (!wordObj.correct && wordObj.expected) {
            alert(`Hint: The correct word was "${wordObj.expected}".
Usage example: "au" is used for masculine singular places, "à la" for feminine.`);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">French Flashcards</h1>
            <p><strong>English:</strong> {currentQuestion.english}</p>

            <input
                type="text"
                className="border p-2 w-full my-4"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your translation..."
            />

            <div className="space-x-2">
                <button
                    onClick={checkAnswer}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Check
                </button>
                <button
                    onClick={nextQuestion}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>

            {feedback && (
                <div className="mt-4">
                    <p>Accuracy: {feedback.accuracy}%</p>
                    <p>
                        {feedback.wordResults.map((w: any, i: number) => (
                            <span
                                key={i}
                                style={getWordStyle(w)}
                                onClick={() => handleWordClick(w)}
                            >
                                {w.word || '[missing]'}{' '}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            <div className="mt-4">
                <p>Score: {score}/{questions.length}</p>
            </div>
        </div>
    );
}
