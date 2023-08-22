import "./markdown.css";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className="markdown-body min-h-screen">
            {children}
        </div>
    );
}
