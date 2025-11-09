import { Cross, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Tooltip({ word, practiceList, setPracticeList, tooltipWord, setTooltipWord}) {
    const practiceConfirmTimeout = useRef<number | null>(null);

    const tooltipRef = useRef(null);

    const handleClickOutside = (event) => {
        if (tooltipRef.current && ! tooltipRef.current.contains(event.target)) {
            setTooltipWord(false);
        }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [tooltipWord == word.expected]);

    const [practiceConfirm, setPracticeConfirm] = useState<{
            word: string;
            visible: boolean;
        } | null>(null);

    const pronouns = [
        'je',
        'tu',
        'il/elle',
        'nous',
        'vous',
        'ils/elles'
    ];

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


    return (
        <>
            {!word.correct && word.expected && tooltipWord === word.expected && (
                <div
                    ref={tooltipRef}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 min-w-[400px]  bg-blue-50/95 text-blue-900 px-4 py-3 rounded-md text-sm shadow-lg border border-blue-200"
                    style={{
                        whiteSpace: 'normal',
                        pointerEvents: 'auto',
                        boxShadow: '0 4px 18px rgba(63, 81, 181, 0.15)',
                    }}
                >
                    <h2 className=" text-lg"><strong className="font-bold">Word:</strong> {word.data.word}</h2>
                    {(word.data.definition) ? (<h3 className="font-bold text-md mb-2">"{word.data.definition}"</h3>) : ''}
                    <div className="columns-2  mb-4">
                        {/* <h2 className=" text-md"><strong className="font-bold">Root:</strong> {word.data.word}</h2> */}
                        <h2 className=" text-md"><strong className="font-bold">Type:</strong> {word.data.type}</h2>
                        {(word.data.feminine_form) ? (<h3 className="font-bold text-md">Feminine: {word.data.feminine_form}</h3>) : ''}
                        {(word.data.contracted_form) ? (<h3 className="font-bold text-md">Contracted: {word.data.contracted_form}</h3>) : ''}
                        {(word.data.type == 'verb') ? (<h3 className="font-bold text-md">Verb Group: {word.data.verb_group}</h3>) : ''}
                    </div>

                    <X className="absolute right-2 top-2 w-8 h-8 hyperlink" onClick={() => {
                        setTooltipWord(false);
                    }}/>

                    {word.data.type == 'verb' ? (
                        <>
                            <div className="mt-4"><h2 className="font-bold text-md">Conjugations: </h2></div>

                            <div className="columns-2  mb-4">
                                <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">{
                                    word.data.conjugations.map((conjugation, index) => (
                                        <li key={index} className="font-bold text-md"><strong className="font-bold">{pronouns[index]}</strong> : {conjugation}</li>
                                    ))
                                }</ul>
                            </div>
                        </>
                    ) : ''}

                    {(word.data.hints) ? (
                        <div className="mb-4">
                            <h2 className="font-bold text-md">Hints: </h2>
                            {word.data.hints}
                        </div>
                    ): ''}


                    <div className="flex items-center justify-between">
                        <button
                            className={`py-1 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow transition ${
                            practiceList.has(word.expected)
                                ? 'opacity-60 cursor-not-allowed'
                                : ''
                            }`}
                            disabled={practiceList.has(word.expected)}
                            onClick={e => {
                                e.stopPropagation();

                                // Do a post request here.


                                addToPracticeList(word.expected);
                            }}
                        >
                            {practiceList.has(word.expected)
                            ? 'Added!'
                            : 'Add to practice list'}
                        </button>

                        {practiceConfirm &&
                            practiceConfirm.word === word.expected &&
                            practiceConfirm.visible && (
                                <span className="ml-4 text-green-700 font-bold">✓ Added!</span>
                            )}
                    </div>
                </div>
            )}
        </>
    )
}
