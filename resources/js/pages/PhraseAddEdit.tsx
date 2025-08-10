import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';

type WordType = 'Verb' | 'Noun' | 'Adjective' | 'Adverb' | '';

interface WordForm {
  word: string;
  exists: boolean;
  type: WordType;
  hints: string;
  infinitive?: string;
  conjugations: string[];
}

export default function PhraseAddEdit() {
  // Mode 1: Phrase input
  const [mode, setMode] = useState<'phrase' | 'words'>('phrase');
  const [french, setFrench] = useState('');
  const [english, setEnglish] = useState('');
  const [phraseId, setPhraseId] = useState<number | null>(null);

  // Mode 2: Word editing
  const [words, setWords] = useState<WordForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingWords, setSavingWords] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle Mode 1 submit: create phrase
  const handlePhraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!french.trim() || !english.trim()) {
      setErrors({ form: 'Both French and English phrases are required.' });
      return;
    }
    setLoading(true);
    router.post(
      '/phrases',
      { french: french.trim(), english: english.trim() },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          console.log(page);

          // Assuming response includes phrase id and french phrase
          const newPhraseId = page.props?.phrase?.id;
          const newFrench = page.props?.phrase?.french || french.trim();

          setPhraseId(newPhraseId || null);
          setLoading(false);
          if (newPhraseId) {
            prepareWords(newFrench);
            setMode('words');
          }
        },
        onError: (errors) => {
          setErrors(errors || {});
          setLoading(false);
        },
      }
    );
  };

  // Prepare word forms for Mode 2
  const prepareWords = (phraseFrench: string) => {
    const splitWords = phraseFrench
      .trim()
      .split(/\s+/)
      .map(w => w.toLowerCase());

    // Call backend API to check existence
    setLoading(true);
    router.post(
      '/words/check-existence',
      { words: splitWords },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          const existingWords: Record<string, boolean> = page.props?.existingWords || {};
          // Build word forms list
          const wordForms: WordForm[] = splitWords.map(w => ({
            word: w,
            exists: !!existingWords[w],
            type: '' as WordType,
            hints: '',
            conjugations: [],
          }));
          setWords(wordForms);
          setLoading(false);
        },
        onError: () => {
          setWords(splitWords.map(w => ({
            word: w,
            exists: false,
            type: '',
            hints: '',
            conjugations: [],
          })));
          setLoading(false);
        },
      }
    );
  };

  // Handle input changes for words
  const updateWordField = (index: number, field: keyof WordForm, value: any) => {
    setWords((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      // If type changed to something other than Verb, clear conjugations
      if (field === 'type' && value !== 'Verb') {
        copy[index].conjugations = [];
        copy[index].infinitive = undefined;
      }
      return copy;
    });
  };

  // Add conjugation input for a verb word
  const addConjugation = (index: number) => {
    setWords((prev) => {
      const copy = [...prev];
      copy[index].conjugations.push('');
      return copy;
    });
  };

  // Update conjugation text
  const updateConjugation = (wordIndex: number, conjIndex: number, value: string) => {
    setWords((prev) => {
      const copy = [...prev];
      copy[wordIndex].conjugations[conjIndex] = value;
      return copy;
    });
  };

  // Remove conjugation input
  const removeConjugation = (wordIndex: number, conjIndex: number) => {
    setWords((prev) => {
      const copy = [...prev];
      copy[wordIndex].conjugations.splice(conjIndex, 1);
      return copy;
    });
  };

  // Submit Mode 2 word data to backend
  const handleWordsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseId) {
      setErrors({ form: 'No phrase selected.' });
      return;
    }
    setSavingWords(true);
    setErrors({});

    // Filter only words that don't exist (new words to create)
    const newWords = words.filter(w => !w.exists).map(w => ({
      word: w.word,
      type: w.type,
      hints: w.hints,
      infinitive: w.type === 'Verb' ? w.infinitive : undefined,
      conjugations: w.type === 'Verb' ? w.conjugations.filter(c => c.trim() !== '') : [],
    }));

    router.post(
      '/words',
      { phrase_id: phraseId, words: newWords },
      {
        onSuccess: () => {
          setSavingWords(false);
          alert('Words saved and linked to phrase!');
          // Optionally reset form or redirect
        },
        onError: (errors) => {
          setErrors(errors || {});
          setSavingWords(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950/80 via-blue-900/60 to-blue-800/50 p-6">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg border border-blue-300/50">
        {mode === 'phrase' && (
          <form onSubmit={handlePhraseSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Add a New Phrase</h2>

            {errors.form && (
              <p className="text-red-600 font-semibold">{errors.form}</p>
            )}

            <div>
              <label className="block mb-1 font-semibold text-gray-700">French Phrase</label>
              <input
                type="text"
                value={french}
                onChange={e => setFrench(e.target.value)}
                className="w-full rounded-md border border-blue-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">English Translation</label>
              <input
                type="text"
                value={english}
                onChange={e => setEnglish(e.target.value)}
                className="w-full rounded-md border border-blue-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md shadow-md transition flex justify-center items-center space-x-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              <span>Add Phrase</span>
            </button>
          </form>
        )}

        {mode === 'words' && (
          <form onSubmit={handleWordsSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Add / Edit Words</h2>

            {errors.form && (
              <p className="text-red-600 font-semibold">{errors.form}</p>
            )}

            {loading ? (
              <p>Loading word data...</p>
            ) : (
              words.map((w, i) => (
                <div key={w.word} className="border border-blue-300 rounded-md p-4 mb-4 bg-white/90">
                  <p className="font-semibold mb-2">
                    Word: <span className="italic">{w.word}</span>{' '}
                                        {w.exists && (
                      <span className="text-green-600 font-semibold ml-2">(Already exists)</span>
                    )}
                  </p>

                  {!w.exists && (
                    <>
                      <label className="block mb-1 font-semibold text-gray-700">
                        Type of word
                      </label>
                      <select
                        value={w.type}
                        onChange={e => updateWordField(i, 'type', e.target.value as WordType)}
                        className="w-full mb-3 rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Verb">Verb</option>
                        <option value="Noun">Noun</option>
                        <option value="Adjective">Adjective</option>
                        <option value="Adverb">Adverb</option>
                      </select>

                      <label className="block mb-1 font-semibold text-gray-700">
                        Hints / Usage Notes
                      </label>
                      <textarea
                        value={w.hints}
                        onChange={e => updateWordField(i, 'hints', e.target.value)}
                        className="w-full mb-3 rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={2}
                        placeholder="Optional hints or usage notes"
                      />

                      {w.type === 'Verb' && (
                        <>
                          <label className="block mb-1 font-semibold text-gray-700">
                            Infinitive form
                          </label>
                          <input
                            type="text"
                            value={w.infinitive || ''}
                            onChange={e => updateWordField(i, 'infinitive', e.target.value)}
                            className="w-full mb-3 rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g., parler"
                            required
                          />

                          <label className="block mb-1 font-semibold text-gray-700">
                            Conjugations
                          </label>
                          {w.conjugations.map((conj, idx) => (
                            <div key={idx} className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                value={conj}
                                onChange={e => updateConjugation(i, idx, e.target.value)}
                                className="flex-grow rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="e.g., parle, parles, parlons"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => removeConjugation(i, idx)}
                                className="px-3 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addConjugation(i)}
                            className="mt-1 inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          >
                            + Add conjugation
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))
            )}

            <button
              type="submit"
              disabled={savingWords}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-md shadow-md transition flex justify-center items-center space-x-2"
            >
              {savingWords && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              <span>Save Words</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
