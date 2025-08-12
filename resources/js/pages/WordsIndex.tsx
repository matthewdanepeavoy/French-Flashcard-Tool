import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PageWrapper from './PageWrapper';
import MainTitle from '@/components/MainTitle';
import Badge from '@/components/Badge';

interface Phrase {
id: number;
french: string;
english: string;
mastered?: boolean;
}

interface Word {
id: number;
word: string;
type: string;
definition: string;
conjugations?: string[]; // now just an array of strings
phrases: Phrase[];
}

interface Props {
words: Record<string, Word[]>; // grouped by type: { 'Verb': [...], 'Noun': [...] }
}

export default function WordsIndex({ words }) {
    const [practiceList, setPracticeList] = useState<Set<string>>(new Set());

    return (
        <PageWrapper practiceList={practiceList} setPracticeList={setPracticeList}>
            <div className="flex items-center justify-center min-h-screen">

                <div className="space-y-8">
                <h1 className="text-4xl font-extrabold mb-6 drop-shadow-sm text-white drop-shadow-lg">
                    Word List
                </h1>

                {Object.entries(words).map(([type, wordsList]) => (
                    <div key={type}>
                    <h2 className="text-3xl font-semibold mb-4 text-white">{type}</h2>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {wordsList
                        .sort((a, b) => a.word.localeCompare(b.word))
                        .map((word) => (
                            <WordCard key={word.id} word={word} />
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </PageWrapper>
    );
};

const WordCard: React.FC<{ word: Word }> = ({ word }) => {
    const totalPhrases = word.phrases.length;
    const masteredCount = word.phrases.filter((p) => p.mastered).length;

    console.log(word);


    return (
        <div className="bg-white rounded-xl shadow-xl shadow-black/40 p-4 flex flex-col space-y-3 relative">

            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-extrabold mb-6 text-blue-900 drop-shadow-sm">
                    {word.word}
                </h1>
                <Badge text={word.level ?? 'A1'} />
                <div className="flex items-center mr-15 mt-2">
                    <span className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-3 py-0.5 font-bold rounded-xl">
                        {totalPhrases == 1 ? 'Phrase' : 'Phrases' }: {totalPhrases}
                        </span>
                </div>

            </div>

            <p className="text-md opacity-90 text-blue-700 font-bold">{word.definition ?? 'en: My definition'}</p>
            <p className="text-md opacity-90">{word.hints ?? 'Here is my hint text. It is a good hint text'}</p>

            {word.conjugations && word.conjugations.length > 0 && (
                <div className="text-md flex flex-wrap gap-2 opacity-80">


                    {/* {word.conjugations.map((form, idx) => (
                        <span
                        key={idx}
                        className="after:content-['•'] last:after:content-['']"
                        >
                        {form}
                        </span>
                    ))} */}
                </div>
            )}


            <div className="flex space-x-2 mt-2 justify-end">
                <button
                    onClick={() => Inertia.get(`/words/${word.id}/edit`)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-md px-3 py-1 rounded shadow"
                >
                    Edit
                </button>
                <button
                    onClick={() => Inertia.get(`/practice?word_id=${word.id}`)}
                    className="bg-blue-800 hover:bg-blue-900 text-white font-semibold text-md px-3 py-1 rounded shadow"
                >
                    Practice Now
                </button>
            </div>
        </div>
    );
};
