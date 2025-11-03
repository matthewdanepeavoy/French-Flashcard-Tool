export default function Badge({text}) {
    return (
        <div className="absolute right-10 top-6">
            <span className="bg-purple-700/80 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm border border-purple-500/60">
                {text}
            </span>
        </div>
    );
}
