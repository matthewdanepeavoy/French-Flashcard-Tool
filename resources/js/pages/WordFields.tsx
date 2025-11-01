import { WordForm, WordType } from "@/types/custom";
import { X } from "lucide-react";
import { useState } from "react";

export default function WordFields({word, i, setWords}) {
    const [showForm, setShowForm] = useState(true);

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

    function updateVerbGroup(wordIndex, group) {
        setWords(words => {
            const updated = [...words];
            updated[wordIndex].group = group;
            console.log(updated, wordIndex);

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

    // Remove conjugation input
    const removeConjugation = (wordIndex: number, conjIndex: number) => {
        setWords((prev) => {
        const copy = [...prev];
        copy[wordIndex].conjugations.splice(conjIndex, 1);
        return copy;
        });
    };

    if (! showForm) {
        return(<div>N</div>);
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
                Word: <span className="italic">{word.word}</span>{' '}
                                    {word.exists && (
                <span className="text-green-600 font-semibold ml-2">(Already exists)</span>
                )}
            </p>

            {! word.exists && (
                <>
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
                    <option value="Verb">Verb</option>
                    <option value="Noun">Noun</option>
                    <option value="Adjective">Adjective</option>
                    <option value="Adverb">Adverb</option>
                </select>

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


                {word.type === 'Verb' && (
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
