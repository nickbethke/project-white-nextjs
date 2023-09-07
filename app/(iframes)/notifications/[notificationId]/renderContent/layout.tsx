import "./markdown.css";
import React from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className="markdown-body min-h-screen">
            {children}
        </div>
    );
}
