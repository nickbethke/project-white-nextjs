import React from "react";
import {Loader as Ldr} from "lucide-react";

type LoaderProps = {
    loading: boolean;
    children: React.ReactNode;
    text?: string;
}

export const Loader = ({loading, children, text}: LoaderProps) => {
    if (!loading) {
        return <>{children}</>;
    }
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-full py-16">
            <Ldr className="animate-spin" size={32}/>
            <span className="text-muted-foreground font-bold">{text ?? "Loading"}</span>
        </div>
    );
};
