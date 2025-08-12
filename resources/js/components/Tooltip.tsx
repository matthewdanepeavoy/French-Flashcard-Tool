import { useEffect, useRef, useState } from "react";

export default function Tooltip({ word, practiceList, setPracticeList, tooltipWord, setTooltipWord}) {
    const practiceConfirmTimeout = useRef<number | null>(null);

    const [practiceConfirm, setPracticeConfirm] = useState<{
            word: string;
            visible: boolean;
        } | null>(null);


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
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 min-w-[250px] max-w-xs bg-blue-50/95 text-blue-900 px-4 py-3 rounded-md text-sm shadow-lg border border-blue-200"
                    style={{
                        whiteSpace: 'normal',
                        pointerEvents: 'auto',
                        boxShadow: '0 4px 18px rgba(63, 81, 181, 0.15)',
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        setTooltipWord(null);
                    }}
                >
                    <div className="mb-2">
                        Hint: The correct word was "{word.expected}". Usage example: "au" is used for masculine singular places, "à la" for feminine.
                    </div>
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
