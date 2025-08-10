import React, { useState, useRef, useEffect } from 'react';
import { PageProps } from '@inertiajs/core';
import { Loader2 } from 'lucide-react';

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

const pronouns = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
const contractionsMap: Record<string, string> = {
    "j'": 'je',
    "l'": 'le',
    "m'": 'me',
    "t'": 'te',
    "s'": 'se',
    "d'": 'de',
    "c'": 'ce',
    "n'": 'ne',
    "qu'": 'que',
    "jusqu'": 'jusque',
    "lorsqu'": 'lorsque',
    "puisqu'": 'puisque',
};

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

    // Join and normalize spaces
    return normalizedWords.join(' ').trim();
}

export default function Flashcards({ questions }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState<Record<number, { tries: number; correct: boolean }>>({});
    // Instead of global tooltip, track only the word for which tooltip is open
    const [tooltipWord, setTooltipWord] = useState<string | null>(null);
    const [practiceList, setPracticeList] = useState<Set<string>>(new Set());
    const [practiceConfirm, setPracticeConfirm] = useState<{
        word: string;
        visible: boolean;
    } | null>(null);
    const tooltipTimeout = useRef<number | null>(null);
    const practiceConfirmTimeout = useRef<number | null>(null);
    const [hasTypedSinceFeedback, setHasTypedSinceFeedback] = useState(false);

    const currentQuestion = questions[currentIndex];

    const autoNextTimeout = useRef<number | null>(null);
    const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

    const checkAnswer = () => {
        const correctPhraseRaw = currentQuestion.french.trim();
        const userAnswerRaw = answer.trim();

        const correctPhrase = normalizePhrase(correctPhraseRaw);
        const userAnswer = normalizePhrase(userAnswerRaw);

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

            if (autoNextTimeout.current) {
            window.clearTimeout(autoNextTimeout.current);
            }
            setIsAutoAdvancing(true);
            autoNextTimeout.current = window.setTimeout(() => {
            setIsAutoAdvancing(false);
            nextQuestion();
            }, 1000);
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
            // Toggle tooltip for this word
            setTooltipWord(prev => prev === wordObj.expected ? null : wordObj.expected);
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
            // Clean up only practiceConfirmTimeout now
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
  <div className="min-h-screen  bg-gradient-to-br from-blue-950/70 via-blue-900/50 to-blue-800/40 px-4">
    <div className="flex justify-between items-center bg-blue-900 text-white p-4 rounded-md mb-6 shadow-md">
      <a
        href="/admin"
        className="font-semibold hover:underline"
      >
        ← Back to Admin Panel
      </a>

      <a href="/phrases">Add phrases</a>

      <div className="">
        <span className="font-semibold mr-2">Practice List:</span>
        {Array.from(practiceList).length === 0 && (
          <span className="italic text-blue-300">No words added yet</span>
        )}
        {Array.from(practiceList).map((word) => (
          <span
            key={word}
            className="inline-flex items-center bg-blue-700 rounded-full px-3 py-1 text-sm font-medium cursor-default select-none"
          >
            {word}
            <button
              onClick={() => {
                setPracticeList(prev => {
                  const copy = new Set(prev);
                  copy.delete(word);
                  return copy;
                });
              }}
              className="ml-2 text-white hover:text-red-400 font-bold focus:outline-none"
              aria-label={`Remove ${word} from practice list`}
              type="button"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
        <div
          className="flex items-center justify-center min-h-screen"
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

            {/* Status message */}
            {feedback && (
              <div className="mb-6 text-gray-800 font-semibold text-base text-center transition-all duration-200 min-h-[1.5em]">
                {statusMsg}
              </div>
            )}

            <p className="text-lg mb-6 text-gray-800">
              <strong>Phrase:</strong> {currentQuestion.english}
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
                    <span key={i} className="relative inline-block mr-2">
                      <span
                        style={getWordStyle(w)}
                        onClick={e => handleWordClick(e, w)}
                        className={`cursor-pointer select-none`}
                      >
                        {w.correct ? w.word : w.expected}
                      </span>
                      {/* Tooltip for incorrect word, only show if this word is selected */}
                      {!w.correct && w.expected && tooltipWord === w.expected && (
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 min-w-[250px] max-w-xs bg-blue-50/95 text-blue-900 px-4 py-3 rounded-md text-sm shadow-lg border border-blue-200"
                          style={{
                            whiteSpace: 'normal',
                            pointerEvents: 'auto',
                            boxShadow: '0 4px 18px rgba(63, 81, 181, 0.15)',
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="mb-2">
                            Hint: The correct word was "{w.expected}". Usage example: "au" is used for masculine singular places, "à la" for feminine.
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              className={`py-1 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow transition ${
                                practiceList.has(w.expected)
                                  ? 'opacity-60 cursor-not-allowed'
                                  : ''
                              }`}
                              disabled={practiceList.has(w.expected)}
                              onClick={e => {
                                e.stopPropagation();
                                addToPracticeList(w.expected);
                              }}
                            >
                              {practiceList.has(w.expected)
                                ? 'Added!'
                                : 'Add to practice list'}
                            </button>
                            {practiceConfirm &&
                              practiceConfirm.word === w.expected &&
                              practiceConfirm.visible && (
                                <span className="ml-4 text-green-700 font-bold">✓ Added!</span>
                              )}
                          </div>
                        </div>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {feedback && (

                <div className="mt-6 text-gray-800 font-semibold text-lg drop-shadow-sm">
              Score: {score} / {questions.length}
            </div>
            )}

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
                    className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md shadow-md transition flex justify-center items-center space-x-2"
                    >
                    <span>Next</span>
                    {isAutoAdvancing && (
                        <Loader2 className="animate-spin"/>
                    )}
                    </button>
              ) : null}
            </div>

            {/* Tooltip is now rendered inline per word */}

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
    </div>

  );
}
