import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import PageWrapper from './PageWrapper';
import WordFields from './WordFields';
import { WordForm } from '@/types/custom';
// import PhraseForm from './PhraseForm';
import MainTitle from '@/components/MainTitle';
import MainContent from './MainContent';
import { PlusCircle } from 'lucide-react';

export default function StoryAdd() {
    const [title, setTitle] = useState('');
    const [sentences, setSentences] = useState([]);

    const [message, setMessage] = useState<Set<string>>();
    const [loading, setLoading] = useState(false);

    // Mode 1: Phrase input
    // const [mode, setMode] = useState<'phrase' | 'words'>('phrase');
    // const [phraseId, setPhraseId] = useState<number | null>(null);

    // Mode 2: Word editing
    // const [words, setWords] = useState<WordForm[]>([]);
    // const [savingWords, setSavingWords] = useState(false);

    // Submit Mode 2 word data to backend

    return (
        <PageWrapper >
            <MainContent>
                    <form
                        onSubmit={(e) => handleStorySubmit(e, title, setTitle, sentences, setSentences)} className="space-y-6"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setSentences((sentences) => [...sentences,  {
                                    translated: '',
                                    english: '',
                                }]);
                            }


                        }}
                    >
                        <MainTitle title={'Add Story'} />

                        <label className="block mb-1 font-semibold text-gray-700">
                            Story Title
                        </label>
                        <input
                                autoFocus
                                type="text"
                                value={title}
                                onChange={e => {
                                    setTitle(e.target.value)
                                }}
                                className="w-full flex-grow rounded-md border border-blue-400 p-2
                                            focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        <hr />

                        {sentences.map((sentence, i) => (
                            <SentenceField key={i} index={i} sentence={sentence} setSentences={setSentences} />
                        ))}

                        <div className="flex">

                        <button
                            type="button"
                            onClick={() => {
                                setSentences((sentences) => [...sentences,  {
                                    translated: '',
                                    english: '',
                                }]);
                            }}
                            className="flex bg-blue-700 hover:bg-blue-800 text-white font-semibold p-3 rounded-md shadow-md transition flex justify-center items-center space-x-2"
                            >
                            <span className="mr-4">Add sentence</span>
                            <PlusCircle />
                        </button>
                        {(sentences.length > 0) ? (<button
                            type="button"
                            onClick={() => {
                                setSentences((sentences) => {
                                    var prev = [...sentences];
                                    prev.pop();
                                    return prev;
                                });
                            }}
                            className="ml-4 lex bg-red-700 hover:bg-red-800 text-white font-semibold p-3 rounded-md shadow-md transition flex justify-center items-center space-x-2"
                            >
                            <span className="mr-4">Remove sentence</span>
                            <PlusCircle />
                        </button>) : ''}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-md shadow-md transition flex justify-center items-center space-x-2"
                        >
                            {/* {savingWords && (
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
                            )} */}
                            <span>Save Story</span>
                        </button>
                    </form>

            </MainContent>
        </PageWrapper>
    );
}

function SentenceField({index, sentence, setSentences}) {

    // const [translated, setTranslated] = useState('');
    // const [english, setEnglish] = useState('');

    return (
        <>
            <label className="block mb-1 font-semibold text-gray-700">
                French
            </label>
            <input
                    autoFocus
                    type="text"
                    value={sentence.translated}
                    onChange={e => {
                        setSentences((prev) => {
                            let d = [...prev];
                            d[index].translated = e.target.value;

                            return d;
                        })

                        // updateWordField(i, 'masculine_form', e.target.value )
                    }}
                    className="w-full flex-grow rounded-md border border-blue-400 p-2
                                focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

            <label className="block mb-1 font-semibold text-gray-700">
                English
            </label>
            <input
                    type="text"
                    value={sentence.english}
                    onChange={e => {
                        setSentences((prev) => {
                            let d = [...prev];
                            d[index].english = e.target.value;

                            return d;
                        })

                        // updateWordField(i, 'masculine_form', e.target.value )
                    }}
                    className="w-full flex-grow rounded-md border border-blue-400 p-2
                                focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <hr />

        </>
    )
}


function handleStorySubmit(e, title, setTitle, sentences, setSentences) {

    e.preventDefault();
    // if (!phraseId) {
    //     setErrors({ form: 'No phrase selected.' });
    //     return;
    // }
    // setSavingWords(true);
    // setErrors({});

    router.post(
        route('story.post'),
        { title, sentences },
        {
            onSuccess: () => {
                setTitle('');
                setSentences([])

                // setMode('phrase');
                // setSavingWords(false);
                // setWords([]);
                // setMessage('Phrase saved successfully');

                // alert('Words saved and linked to phrase!');
                // Optionally reset form or redirect
            },
            // onError: (errors) => {
                // setErrors(errors || {});
                // setSavingWords(false);
            // },
        }
    );
};
