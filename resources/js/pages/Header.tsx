export default function Header() {
    return(
        <div className="flex justify-between items-center bg-blue-900 text-white p-4  mb-6 shadow-md">
            <a
                href="/admin/phrases"
                className="font-semibold hover:underline"
            >
                ← Back to Admin Panel
            </a>
            <div>

            List:
            <a className="mx-3 font-bold" href="/phrases/index">Phrases</a> |
            <a className="mx-3 font-bold" href="/words/index">Words</a> |
            <a className="mx-3 font-bold"  href="/phrases">Add new</a> |
            </div>

            <div className="">
                <span className="text-bold-xl">Practice: </span>
                <a className="font-semibold mr-2" href="/">Random</a> |
                <a href="/?type=words" className="font-semibold ml-4 mr-2">Words</a> |
                <a href="/?type=phrases" className="font-semibold mr-2 ml-4">Phrases</a>

            </div>

            <div className="">
                <span className="text-bold-xl">Stories: </span>
                <a className="font-semibold mr-2" href={route('story.add')} >Add new</a> |
                {/* <a href="/?type=words" className="font-semibold ml-4 mr-2">Add</a> | */}
                {/* <a href="/?type=phrases" className="font-semibold mr-2 ml-4">Phrases</a> */}

            </div>
        </div>
    );
}
