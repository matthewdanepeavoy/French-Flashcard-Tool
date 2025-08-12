import { useRef, useState } from "react";
import Tooltip from "./Tooltip";

export default function AnswerBox({feedback, practiceList, setPracticeList}) {

    return(
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
            <div className="text-xl">
                {feedback.wordResults.map((word: any, i: number) => (
                    <WordAnswer key={i} word={word} practiceList={practiceList} setPracticeList={setPracticeList} />
                ))}
            </div>
        </div>
    );
}

function WordAnswer({word, practiceList, setPracticeList}) {
    const [tooltipWord, setTooltipWord] = useState<string | null>(null);

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

    return(
        <span className="relative inline-block mr-2">
            <span
                style={getWordStyle(word)}
                onClick={e => handleWordClick(e, word)}
                className={`cursor-pointer select-none`}
                >
                {word.correct ? word.word : word.expected}
            </span>

            <Tooltip word={word} practiceList={practiceList} setPracticeList={setPracticeList} tooltipWord={tooltipWord} setTooltipWord={setTooltipWord}/>
        </span>
    )
}
