import React, { useState, useRef, useEffect } from 'react';
import { PageProps } from '@inertiajs/core';

type Question = {
    id: number;
    english: string;
    french: string;
};

interface Props extends PageProps {
    questions: Question[];
}

function stripPunctuation(text: string) {
    return text.replace(/[.,!?;:]/g, '');
}

export default function Flashcards({ questions }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState<Record<number, { tries: number; correct: boolean }>>({});
    const [tooltip, setTooltip] = useState<{
        text: string;
        x: number;
        y: number;
        word?: string;
    } | null>(null);
    const [practiceList, setPracticeList] = useState<Set<string>>(new Set());
    const [practiceConfirm, setPracticeConfirm] = useState<{
        word: string;
        visible: boolean;
    } | null>(null);
    const tooltipTimeout = useRef<number | null>(null);
    const practiceConfirmTimeout = useRef<number | null>(null);
    const [hasTypedSinceFeedback, setHasTypedSinceFeedback] = useState(false);

    const currentQuestion = questions[currentIndex];

    const checkAnswer = () => {
        const correctPhraseRaw = currentQuestion.french.trim();
        const userAnswerRaw = answer.trim();

        const correctPhrase = stripPunctuation(correctPhraseRaw).toLowerCase();
        const userAnswer = stripPunctuation(userAnswerRaw).toLowerCase();

        const correctWords = correctPhrase.split(/\s+/);
        const userWords = userAnswer.split(/\s+/);

        let correctCount = 0;
        const usedIndices = new Set<number>();
        const wordResults = correctWords.map((word) => {
            // Find an unmatched user word that matches this expected word
            const userWordIndex = userWords.findIndex((uw, idx) => uw === word && !usedIndices.has(idx));
            if (userWordIndex !== -1) {
                usedIndices.add(userWordIndex);
                correctCount++;
                return { word: word, correct: true };
            } else {
                return { word: word, correct: false, expected: word };
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
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        setAnswer('');
        setHasTypedSinceFeedback(false);
        setCurrentIndex(prev => (prev + 1) % questions.length);
    };

    const retryQuestion = () => {
        setFeedback(null);
        setAnswer('');
        setHasTypedSinceFeedback(false);
    };

    const getWordStyle = (wordObj: any) => {
        if (wordObj.correct) {
            return {
                color: '#0f5132',
                fontWeight: '600',
                cursor: 'default',
                textShadow: 'none',
                backgroundColor: 'rgba(144,238,144,0.3)',
                borderRadius: '4px',
                padding: '0 3px',
            };
        }
        return {
            color: '#b45309', // amber/dark orange
            cursor: 'pointer',
            textDecoration: 'underline',
            backgroundColor: 'rgba(255,165,0,0.15)',
            borderRadius: '4px',
            padding: '0 3px',
        };
    };

    const handleWordClick = (
        e: React.MouseEvent<HTMLSpanElement>,
        wordObj: any
    ) => {
        if (!wordObj.correct && wordObj.expected) {
            const rect = e.currentTarget.getBoundingClientRect();
            const tooltipText = `Hint: The correct word was "${wordObj.expected}". Usage example: "au" is used for masculine singular places, "à la" for feminine.`;

            if (tooltipTimeout.current) {
                window.clearTimeout(tooltipTimeout.current);
            }

            setTooltip({
                text: tooltipText,
                x: rect.left + rect.width / 2,
                y: rect.bottom + window.scrollY + 8, // below the word
                word: wordObj.expected,
            });
        }
    };

    // Add to practice list
    const addToPracticeList = (word: string) => {
        setPracticeList(prev => new Set(prev).add(word));
        setPracticeConfirm({ word, visible: true });
        if (practiceConfirmTimeout.current) {
            window.clearTimeout(practiceConfirmTimeout.current);
        }
        practiceConfirmTimeout.current = window.setTimeout(() => {
            setPracticeConfirm(null);
        }, 1500);
    };

    useEffect(() => {
        return () => {
            if (tooltipTimeout.current) {
                window.clearTimeout(tooltipTimeout.current);
            }
            if (practiceConfirmTimeout.current) {
                window.clearTimeout(practiceConfirmTimeout.current);
            }
        };
    }, []);

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

    // Stats
    const totalCorrect = Object.values(attempts).reduce(
        (sum, a) => sum + (a.correct ? a.tries : 0),
        0
    );
    const totalIncorrect = Object.values(attempts).reduce(
        (sum, a) => sum + (!a.correct ? a.tries : 0),
        0
    );
    const totalAnswered = Object.values(attempts).reduce(
        (sum, a) => sum + a.tries,
        0
    );
  // Modified average accuracy calculation: only first attempt counts
  const avgAccuracy =
    totalAnswered > 0
      ? Math.round(
          (Object.values(attempts).reduce((sum, a) => {
            // count 100 if first attempt correct, else 0
            return sum + (a.correct && a.tries === 1 ? 100 : 0);
          }, 0) /
            Object.values(attempts).filter((a) => a.tries >= 1).length) || 1
        )
      : 0;

  // Status message uses gray instead of purple
  let statusMsg = '';
  if (feedback && feedback.accuracy !== undefined) {
    if (feedback.accuracy === 100) {
      statusMsg = "Magnifique! C'est parfait! 🥖🇫🇷";
    } else if (feedback.accuracy >= 80) {
      statusMsg = "Très bien! Presque parfait!";
    } else if (feedback.accuracy >= 50) {
      statusMsg = "Pas mal, mais tu peux faire mieux! 🍷";
    } else {
      statusMsg = "Ooh là là... On recommence, d'accord?";
    }
  }
// (inside your Flashcards component)



  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950/70 via-blue-900/50 to-blue-800/40 px-4"
    >
      <div
        className="max-w-xl w-full bg-white rounded-xl p-8 shadow-lg border border-blue-200/30 relative"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 64, 255, 0.25)',
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(63, 81, 181, 0.18)',
        }}
      >
        {/* Level badge */}
        <div className="absolute right-6 top-6">
          <span className="bg-purple-700/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-purple-500/60">
            Level A1
          </span>
        </div>
        <h1 className="text-4xl font-extrabold mb-6 text-blue-900 drop-shadow-sm">
          French Flashcards
        </h1>
        <p className="text-lg mb-6 text-gray-800">
          <strong>English:</strong> {currentQuestion.english}
        </p>

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

        <div className="flex space-x-4 mt-6">
          {!feedback && (
            <button
              onClick={checkAnswer}
              className="flex-1 py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md shadow-md transition"
            >
              Check
            </button>
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
              className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md shadow-md transition"
            >
              Next
            </button>
          ) : null}
        </div>

        {/* Status message */}
        {feedback && (
          <div className="mt-4 text-gray-800 font-semibold text-base text-center transition-all duration-200 min-h-[1.5em]">
            {statusMsg}
          </div>
        )}

        {feedback && (
          <div
            className="mt-8 p-4 rounded-md bg-blue-50/80 shadow-inner text-blue-900"
            style={{
              boxShadow:
                '0 0 10px 3px rgba(30, 64, 255, 0.08) inset, 0 0 15px 5px rgba(63, 81, 181, 0.08) inset',
            }}
          >
            <p className="font-semibold mb-2 text-blue-900 drop-shadow-sm">
              Accuracy: {feedback.accuracy}%
            </p>
            <p className="text-xl">
              {feedback.wordResults.map((w: any, i: number) => (
                <span
                  key={i}
                  style={getWordStyle(w)}
                  onClick={e => handleWordClick(e, w)}
                  className="mr-2 cursor-pointer select-none"
                >
                  {w.correct ? w.word : w.expected}
                </span>
              ))}
            </p>
          </div>
        )}

        <div className="mt-6 text-gray-800 font-semibold text-lg drop-shadow-sm">
          Score: {score} / {questions.length}
        </div>

        {/* Tooltip popup for word hints and practice list */}
        {tooltip && (
          <div
            className="absolute z-50 min-w-[250px] max-w-xs bg-blue-50/95 text-blue-900 px-4 py-3 rounded-md text-sm shadow-lg border border-blue-200"
            style={{
              top: tooltip.y,
              left: tooltip.x,
              transform: 'translate(-50%, 0%)',
              whiteSpace: 'normal',
              pointerEvents: 'auto',
              boxShadow: '0 4px 18px rgba(63, 81, 181, 0.15)',
            }}
          >
            <div className="mb-2">{tooltip.text}</div>
            {tooltip.word && (
              <div className="flex items-center justify-between">
                <button
                  className={`py-1 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow transition ${
                    practiceList.has(tooltip.word)
                      ? 'opacity-60 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={practiceList.has(tooltip.word)}
                  onClick={e => {
                    e.stopPropagation();
                    addToPracticeList(tooltip.word!);
                  }}
                >
                  {practiceList.has(tooltip.word)
                    ? 'Added!'
                    : 'Add to practice list'}
                </button>
                {practiceConfirm &&
                  practiceConfirm.word === tooltip.word &&
                  practiceConfirm.visible && (
                    <span className="ml-4 text-green-700 font-bold">✓ Added!</span>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Statistics section */}
        <div className="mt-8 pt-5 border-t border-gray-300/30">
          <div className="flex flex-wrap justify-between text-gray-800 text-sm font-medium">
            <div>
              <span className="font-semibold">Total correct:</span> {totalCorrect}
            </div>
            <div>
              <span className="font-semibold">Total incorrect:</span> {totalIncorrect}
            </div>
            <div>
              <span className="font-semibold">Avg. accuracy:</span> {avgAccuracy}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
