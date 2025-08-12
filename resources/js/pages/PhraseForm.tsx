import Badge from "@/components/Badge";
import MainTitle from "@/components/MainTitle";
import { WordForm, WordType } from "@/types/custom";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function PhraseForm({setMode, errors, setErrors, loading, setLoading, setPhraseId, setWords}) {
    const [french, setFrench] = useState('');
    const [english, setEnglish] = useState('');

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
        });
    };



    return(
        <form onSubmit={handlePhraseSubmit} className="space-y-6">
            <Badge text={'Level A1'}/>
            <MainTitle title={'Add a New Phrase'} />

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
    );
}
