import Header from "./Header";

export default function PageWrapper({children}) {
    return(
        <div className="min-h-screen  bg-gradient-to-br from-blue-950/80 via-blue-900/60 to-blue-800/50  ">
            <Header />
            {children}
        </div>
    );
}
