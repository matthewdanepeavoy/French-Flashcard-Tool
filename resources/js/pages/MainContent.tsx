export default function MainContent({children}) {
    return(
        <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center min-h-screen">
                <div
                    className="max-w-xl min-w-[800px] w-full bg-white rounded-xl p-8 shadow-lg border border-blue-200/30 relative"
                    style={{
                        boxShadow: '0 8px 32px 0 rgba(31, 64, 255, 0.25)',
                        WebkitBackdropFilter: 'blur(10px)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(63, 81, 181, 0.18)',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
