export default function Header({practiceList, setPracticeList}) {
    return(
        <div className="flex justify-between items-center bg-blue-900 text-white p-4  mb-6 shadow-md">
            <a
                href="/admin/phrases"
                className="font-semibold hover:underline"
            >
                ← Back to Admin Panel
            </a>

            <a href="/">Random Practice</a>
            <a href="/words/index">View Words</a>
            <a href="/phrases">Add phrases</a>

            <div className="">
                <span className="font-semibold mr-2">Practice List:</span>
                {Array.from(practiceList).length === 0 && (
                <span className="italic text-blue-300">No words added yet</span>
                )}
                {Array.from(practiceList).map((word) => (
                <span
                    key={word}
                    className="inline-flex items-center bg-blue-700 rounded-full px-3 py-1 text-sm font-medium cursor-default select-none"
                >
                    {word}
                    <button
                    onClick={() => {
                        setPracticeList(prev => {
                        const copy = new Set(prev);
                        copy.delete(word);
                        return copy;
                        });
                    }}
                    className="ml-2 text-white hover:text-red-400 font-bold focus:outline-none"
                    aria-label={`Remove ${word} from practice list`}
                    type="button"
                    >
                    &times;
                    </button>
                </span>
                ))}
            </div>
            </div>
    );
}
