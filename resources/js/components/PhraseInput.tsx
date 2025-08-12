export default function PhraseInput({feedback, answer, setFeedback, setAnswer, handleKeyDown}) {
    return(
        <input
            type="text"
            className={
                "w-full p-3 rounded-md border border-blue-400/40 text-blue-900 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-70 transition shadow-sm " +
                (feedback?.isExact
                    ? "bg-blue-100 cursor-not-allowed"
                    : "bg-blue-50/60")
            }
            placeholder="Type your translation..."
            value={answer}
            onChange={e => {
                setAnswer(e.target.value);
                if (feedback && feedback.accuracy < 80) {
                    setFeedback(null);
                }
                setHasTypedSinceFeedback(true);
            }}

            onKeyDown={handleKeyDown}
            autoComplete="off"
            readOnly={feedback?.isExact === true}
        />
    )
}
