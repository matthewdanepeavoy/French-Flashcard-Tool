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
            <a href="/phrases/index">View Phrases</a>
            <a href="/words/index">View Words</a>
            <a href="/phrases">Add phrases</a>

            <div className="">
                <span className="text-bold-xl">Practice: </span>
                <a href="/?type=words" className="font-semibold mr-2">Words</a> |
                <a href="/?type=phrases" className="font-semibold mr-2 ml-4">Phrases</a>
            </div>
            </div>
    );
}
