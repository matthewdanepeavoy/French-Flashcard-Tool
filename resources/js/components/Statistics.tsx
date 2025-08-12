export default function Statistics({attempts}) {
        // Stats
    const totalCorrect = Object.values(attempts).reduce(
        (sum, a) => sum + (a.correct ? a.tries : 0),
        0
    );

    const totalIncorrect = Object.values(attempts).reduce(
        (sum, a) => sum + (!a.correct ? a.tries : 0),
        0
    );
    const totalAnswered = Object.values(attempts).reduce(
        (sum, a) => sum + a.tries,
        0
    );

    // Modified average accuracy calculation: only first attempt counts
    const avgAccuracy =
        totalAnswered > 0
            ? Math.round(
                (Object.values(attempts).reduce((sum, a) => {
                // count 100 if first attempt correct, else 0
                return sum + (a.correct && a.tries === 1 ? 100 : 0);
                }, 0) /
                Object.values(attempts).filter((a) => a.tries >= 1).length) || 1
            )
            : 0;

    return (
        <div className="mt-8 pt-5 border-t border-gray-300/30">
            <div className="flex flex-wrap justify-between text-gray-800 text-sm font-medium">
            <div>
                <span className="font-semibold">Total correct:</span> {totalCorrect}
            </div>
            <div>
                <span className="font-semibold">Total incorrect:</span> {totalIncorrect}
            </div>
            <div>
                <span className="font-semibold">Avg. accuracy:</span> {avgAccuracy}%
            </div>
            </div>
        </div>
    )
}
