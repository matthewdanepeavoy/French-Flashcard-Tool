import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import PageWrapper from './PageWrapper';
import WordFields from './WordFields';
import { WordForm } from '@/types/custom';
import PhraseForm from './PhraseForm';
import MainTitle from '@/components/MainTitle';
import MainContent from './MainContent';

export default function PhraseAddEdit() {
    const [practiceList, setPracticeList] = useState<Set<string>>(new Set());
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<Set<string>>();
    const [loading, setLoading] = useState(false);

    // Mode 1: Phrase input
    const [mode, setMode] = useState<'phrase' | 'words'>('phrase');
    const [phraseId, setPhraseId] = useState<number | null>(null);

    // Mode 2: Word editing
    const [words, setWords] = useState<WordForm[]>([]);
    const [savingWords, setSavingWords] = useState(false);

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
        const formattedWords = words
                // .filter(w => !w.exists)
            .map(w => ({
            word: w.word,
            id: w.id,
            exists: w.exists,
            type: w.type,
            definition: w.definition,
            feminine_form: w.feminine_form,
            contracted_form: w.contracted_form,
            hints: w.hints,
            group: w.group,
            infinitive: w.type === 'verb' ? w.infinitive : undefined,
            conjugations: w.type === 'verb' ? w.conjugations.filter(c => c.trim() !== '') : [],
        }));

        router.post(
            '/words',
            { phrase_id: phraseId, words: formattedWords },
            {
                onSuccess: (page) => {
                    setMode('phrase');
                    setSavingWords(false);
                    setWords([]);
                    setMessage('Phrase saved successfully');
                    //   alert('hi');
                    //   console.log(page);

                    // alert('Words saved and linked to phrase!');
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
        <PageWrapper practiceList={practiceList} setPracticeList={setPracticeList}>
            <MainContent>
                {mode === 'phrase' && (
                        <PhraseForm setMode={setMode} errors={errors} setErrors={setErrors} message={message} loading={loading} setLoading={setLoading} setPhraseId={setPhraseId} setWords={setWords}/>
                    )}

                    {mode === 'words' && (
                    <form onSubmit={handleWordsSubmit} className="space-y-6">
                        <MainTitle title={'Add / Edit Words'} />

                        {errors.form && (
                        <p className="text-red-600 font-semibold">{errors.form}</p>
                        )}

                        {loading ? (
                            <p>Loading word data...</p>
                        ) : (
                            words.map((w, i) => (
                                <WordFields key={i} i={i} word={w} setWords={setWords}/>
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
            </MainContent>
        </PageWrapper>
    );
}
