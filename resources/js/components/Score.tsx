export default function Score({score, total}) {
    return (
        <div className="mt-6 text-gray-800 font-semibold text-lg drop-shadow-sm">
            Score: {score} / {total}
        </div>
    )
}
