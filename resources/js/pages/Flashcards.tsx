import React, { useState, useRef, useEffect } from 'react';
import { PageProps, router } from '@inertiajs/core';
import { Loader2 } from 'lucide-react';
import PageWrapper from './PageWrapper';
import Badge from '@/components/Badge';
import MainTitle from '@/components/MainTitle';
import StatusMessage from '@/components/StatusMessage';
import Statistics from '@/components/Statistics';
import AnswerBox from '@/components/AnswerBox';
import Score from '@/components/Score';
import PhraseInput from '@/components/PhraseInput';
import MainContent from './MainContent';
import { contractionsMap, pronouns } from '@/types/custom';

type Question = {
    id: number;
    english: string;
    phrase: string;
    hint: string;
};

interface Props extends PageProps {
    questions: Question[];
}


    // Words need a masculine & feminine forms
    // Nouns, pronouns, adjectives, etc.
    // We also need contraction mapping to words???

function normalizePhrase(text: string): string {
    // Lowercase
    let lower = text.toLowerCase();

    // Remove punctuation except hyphen and apostrophe (we need them for contractions and inversion)
    lower = lower.replace(/[.,!?;:]/g, '');

    // Expand contractions (e.g. j'aime -> je aime)
    Object.entries(contractionsMap).forEach(([contracted, expanded]) => {
        // Replace contracted form at start of word
        const re = new RegExp(`\\b${contracted}`, 'g');
        lower = lower.replace(re, expanded + ' ');
    });

    // Handle inverted verb-subject pairs with hyphens (e.g., "aimes-tu" -> "tu aimes")
    // We'll look for pattern: word1-word2 where word2 is pronoun, swap order and remove hyphen
    const words = lower.split(/\s+/);
    const normalizedWords: string[] = [];
    words.forEach(word => {
        const parts = word.split('-');
        if (parts.length === 2 && pronouns.includes(parts[1])) {
            // Swap order
            normalizedWords.push(parts[1]);
            normalizedWords.push(parts[0]);
        } else {
            normalizedWords.push(word);
        }
    });

    const joined = normalizedWords.join(' ').trim();

    return joined;
    // return joined.replace('_', ' ');
}

export default function Flashcards({ questions }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState<Record<number, { tries: number; correct: boolean }>>({});

    const [practiceList, setPracticeList] = useState<Set<string>>(new Set());

    const [hasTypedSinceFeedback, setHasTypedSinceFeedback] = useState(false);

    const currentQuestion = questions[currentIndex];

    var hasFormality = false;
    var isFormal = false;

    if (currentQuestion.phrase.includes('vous') ||
        currentQuestion.phrase.includes('vos'))
    {
        hasFormality = true;
        isFormal = true;
    }
    if (currentQuestion.phrase.includes('tu') ||
        currentQuestion.phrase.includes("t'") ||
        currentQuestion.phrase.includes('ton') ||
        currentQuestion.phrase.includes('te') ||
        currentQuestion.phrase.includes('ta')
    ) {
        hasFormality = true;
        isFormal = false;
    }

    const autoNextTimeout = useRef<number | null>(null);
    const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

    const checkAnswer = () => {
        const correctPhraseRaw = currentQuestion.phrase.trim();
        const userAnswerRaw = answer.trim();

        const correctPhrase = normalizePhrase(correctPhraseRaw);
        const userAnswer = normalizePhrase(userAnswerRaw);

        const correctWords = correctPhrase.split(/\s+/);
        const userWords = userAnswer.split(/\s+/);

        let correctCount = 0;
        const usedIndices = new Set<number>();
        const wordResults = correctWords.map((word) => {
            const wordData = currentQuestion.words.filter((data) => {

                if (word == data.word) return true;
                if (word == data.word + 's') return true;
                if (word == data.word + 'x') return true;
                if (word == data.feminine_form) return true;
                if (word == data.feminine_form + 's') return true;

                if (data.conjugations && data.conjugations.includes(word)) return true;
            });

            // Find an unmatched user word that matches this expected word
            const userWordIndex = userWords.findIndex((uw, idx) => uw === word && !usedIndices.has(idx));
            if (userWordIndex !== -1) {
                usedIndices.add(userWordIndex);
                correctCount++;
                return { word: word, data: (wordData.length > 0) ? wordData[0] : null, correct: true };
            } else {
                return { word: word, data: (wordData.length > 0) ? wordData[0] : null, correct: false, expected: word };
            }
        });

        const accuracy = Math.round((correctCount / correctWords.length) * 100);
        const isExact = userAnswer === correctPhrase;


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

            if (autoNextTimeout.current) {
                window.clearTimeout(autoNextTimeout.current);
            }

            setIsAutoAdvancing(true);
            autoNextTimeout.current = window.setTimeout(() => {
            setIsAutoAdvancing(false);
            nextQuestion();

            // API CALL HERE
            router.post(
                route('flashcards.check'),
                {
                    question: currentQuestion, attempts: attempts[currentQuestion.id]
                },
                {
                    onSuccess: () => {

                    },
                    // onError: (errors) => {

                    // },
                }
            );


            }, 1000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!feedback) {
                checkAnswer();
            } else {
                if (feedback.isExact) {
                    nextQuestion();
                } else {
                    retryQuestion();
                }
            }
        }
    };

    const nextQuestion = () => {
        if (autoNextTimeout.current) {
            window.clearTimeout(autoNextTimeout.current);
        }
        setIsAutoAdvancing(false);
        setFeedback(null);
        setAnswer('');
        setHasTypedSinceFeedback(false);
        setCurrentIndex(prev => (prev + 1) % questions.length);
    };

    useEffect(() => {
        return () => {
            if (autoNextTimeout.current) {
            window.clearTimeout(autoNextTimeout.current);
            }
        };
        }, []);

    const retryQuestion = () => {
        setFeedback(null);
        setAnswer('');
        setHasTypedSinceFeedback(false);
    };

    if (! currentQuestion) {
        return (
        <PageWrapper practiceList={practiceList} setPracticeList={setPracticeList}>
            <MainContent>
                <p className="text-lg mb-6 text-gray-800">No available phrases. Please create one</p>
            </MainContent>

        </PageWrapper>

        );
    }

    return (
        <PageWrapper practiceList={practiceList} setPracticeList={setPracticeList}>
            <MainContent>
                <Badge text={'Level A1'} />
                <MainTitle title={'French Flashcards'} />

                {feedback && (
                    <StatusMessage feedback={feedback }/>
                )}

                {/* Question form */}
                <p className="text-lg mb-2 text-gray-800">
                    <strong>Phrase:</strong> {currentQuestion.english} <span className="italic text-gray-500 ml-3">{ hasFormality ? (isFormal ? '(formal)' : '') : '' }</span>
                </p>

                {(currentQuestion.hint) ? (
                    <p className="text-md mt-2 mb-6 text-blue-500">
                        <strong>Hint: </strong>{currentQuestion.hint}
                    </p>
                ): ''}

                <input
                    type="text"
                    className={
                        "w-full p-3 rounded-md border border-blue-400/40 text-blue-900 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-70 transition shadow-sm " +
                        (feedback?.isExact
                            ? "bg-blue-100 cursor-not-allowed"
                            : "bg-blue-50/60")
                    }
                    placeholder="Type your translation..."
                    value={answer}
                    onChange={e => {
                        setAnswer(e.target.value);
                        if (feedback && feedback.accuracy < 80) {
                            setFeedback(null);
                        }
                        setHasTypedSinceFeedback(true);
                    }}

                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    readOnly={feedback?.isExact === true}
                />

                {feedback && (
                    <AnswerBox feedback={feedback} practiceList={practiceList} setPracticeList={setPracticeList}/>
                )}

                {feedback && (
                    <Score score={score} total={questions.length}/>
                )}

                <CheckButton answer={answer} feedback={feedback} checkAnswer={checkAnswer} nextQuestion={nextQuestion} retryQuestion={retryQuestion} hasTypedSinceFeedback={hasTypedSinceFeedback} isAutoAdvancing={isAutoAdvancing}/>

                {/* Statistics section */}
                <Statistics attempts={attempts} />
            </MainContent>
        </PageWrapper>
    );
}

function CheckButton({answer, feedback, checkAnswer, retryQuestion, nextQuestion, isAutoAdvancing, hasTypedSinceFeedback}) {
    return(
        <div className="flex space-x-4 mt-6">
            {!feedback && (
                <button
                    onClick={checkAnswer}
                    className="flex-1 py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md shadow-md transition"
                >Check</button>
            )}
            {feedback && feedback.accuracy < 80 ? (
                <button
                    onClick={retryQuestion}
                    disabled={!hasTypedSinceFeedback || answer.trim() === ''}
                    className={`flex-1 py-3 font-semibold rounded-md shadow-md transition ${
                    !hasTypedSinceFeedback || answer.trim() === ''
                        ? 'bg-blue-700 text-white opacity-50 cursor-not-allowed'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                    }`}
                >
                    Retry
                </button>
            ) : feedback ? (
            <button
                onClick={nextQuestion}
                className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md shadow-md transition flex justify-center items-center space-x-2"
                >
                <span>Next</span>
                {isAutoAdvancing && (
                    <Loader2 className="animate-spin"/>
                )}
                </button>
            ) : null}
        </div>
    );
}
