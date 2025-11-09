import { WordForm, WordType } from "@/types/custom";
import { X } from "lucide-react";
import { useState } from "react";

export default function WordFields({word, i, setWords}) {
    const [showForm, setShowForm] = useState(true);

    // Handle input changes for words
    const updateWordField = (index: number, field: keyof WordForm, value: string) => {
        setWords((prev) => {
            const words = [...prev];
            words[index] = { ...words[index], [field]: value };
            // If type changed to something other than Verb, clear conjugations
            if (field === 'type' && value !== 'verb') {
                words[index].conjugations = [];
                words[index].infinitive = undefined;
            }
            return words;
        });
    };

    function updateVerbGroup(wordIndex, group) {
        setWords(words => {
            const updated = [...words];
            updated[wordIndex].group = group;

            return updated;
        });
    }

    const conjugationLabels = [
        "infinitive",
        "je / j'",
        "tu",
        "il / elle / on",
        "nous",
        "vous",
        "ils / elles"
    ];

    // Update conjugation text
    const updateConjugation = (wordIndex: number, conjIndex: number, value: string) => {
        setWords((prev) => {
        const copy = [...prev];
        copy[wordIndex].conjugations[conjIndex] = value;
        return copy;
        });
    };

    if (! showForm) {
        return(<div>Word skipped</div>);
    }

    if (word.exists) {
        setWords((prev) => {
            const copy = [...prev];
            copy[i].id = word.id;

            // copy[i].conjugations.splice(conjIndex, 1);
        return prev;
        });

    }

    return(
        <div key={word.word} className="border border-blue-300 rounded-md p-4 mb-4 bg-white/90 relative">
            <button
                type="button"
                onClick={() => {
                    setShowForm(false);
                }}
                className="mt-1 absolute right-0 top-0 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
                <X />
            </button>
            <p className="font-semibold mb-2">
                {word.exists && (
                    <>
                    Word: <span className="italic">{word.word}</span>{' '}
                    <span className="text-green-600 font-semibold ml-2">(Already exists)</span>
                    </>
                )}

                {! word.exists && (
                    <>
                    <label className="block mb-1 font-semibold text-gray-700">
                        Word
                    </label>
                    <input
                            type="text"
                            value={word.masculine_form ?? word.word}
                            onChange={e => updateWordField(i, 'masculine_form', e.target.value )}
                            className="flex-grow rounded-md border border-blue-400 p-2
                                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </>
                )}



            </p>

            {! word.exists && (
                <>
                <label className="block mb-1 font-semibold text-gray-700">
                    Definition
                </label>
                <input
                    value={word.definition ?? ""}
                    onChange={e => updateWordField(i, 'definition', e.target.value as WordType)}
                    className="w-full mb-3 rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <label className="block mb-1 font-semibold text-gray-700">
                    Type of word
                </label>
                <select
                    value={word.type}
                    onChange={e => updateWordField(i, 'type', e.target.value as WordType)}
                    className="w-full mb-3 rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select type</option>
                    <option value="noun">Noun</option>
                    <option value="pronoun">Pronoun</option>
                    <option value="article">Prepositional / Article</option>
                    <option value="adjective">Adjective</option>
                    <option value="verb">Verb</option>
                    <option value="adverb">Adverb</option>
                </select>

                {word.type !== 'verb' && (
                    <div className="flex">

                        <div className="flex flex-col flex-1">

                            <label className="block mb-1 font-semibold text-gray-700">
                                Feminine form
                            </label>
                            <input
                                type="text"
                                value={word.feminine_form ?? ""}
                                onChange={e => updateWordField(i, 'feminine_form', e.target.value as WordType)}
                                className="flex-grow rounded-md border border-blue-400 p-2
                                            focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="flex flex-col flex-1 ml-4">
                            <label className="block mb-1 font-semibold text-gray-700">
                                Contracted form
                            </label>
                            <input
                                type="text"
                                value={word.contracted_form ?? ""}
                                onChange={e => updateWordField(i, 'contracted_form', e.target.value as WordType)}
                                className="flex-grow rounded-md border border-blue-400 p-2
                                            focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                )}



                <label className="block mb-1 font-semibold text-gray-700">
                    Hints / Usage Notes
                </label>
                <textarea
                    value={word.hints}
                    onChange={e => updateWordField(i, 'hints', e.target.value)}
                    className="w-full mb-3 rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={2}
                    placeholder="Optional hints or usage notes"
                />

                {word.type === 'verb' && (
                    <>
                    {/** Verb Group Selector */}
                    <div className="mb-4">
                        <label className="block font-semibold mb-1 text-gray-700">
                            Verb Group
                        </label>
                        <select
                            value={word.group || ""}
                            onChange={e => updateVerbGroup(i, e.target.value)}
                            className="w-full rounded-md border border-blue-400 p-2
                                    focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            required
                        >
                            <option value="" disabled>Select group</option>
                            <option value="1">1st Group — ER verbs (parler, aimer)</option>
                            <option value="2">2nd Group — IR verbs (finir, choisir)</option>
                            <option value="3">3rd Group — Irregular verbs (être, avoir, aller, prendre)</option>
                        </select>
                    </div>

                    <label className="block mb-1 font-semibold text-gray-700">
                        Conjugations
                    </label>
                    {conjugationLabels.map((label, idx) => (
                    <div key={idx} className="flex items-center space-x-2 mb-2">
                        <span className="w-28 text-right font-semibold text-gray-700">{label}</span>

                        <input
                            type="text"
                            value={word.conjugations[idx] ?? ""}
                            onChange={e => updateConjugation(i, idx, e.target.value)}
                            className="flex-grow rounded-md border border-blue-400 p-2
                                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    ))}
                    </>
                )}
                </>
            )}
        </div>
    )
}
