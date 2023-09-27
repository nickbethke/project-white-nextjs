import Link from "next/link";
import {Eye, Pen, Trash} from "lucide-react";
import React from "react";
import {ApiFile} from "@/types/file";

type FileActionsButtonsProps = {
    file: ApiFile;
}

export const FileActionsButtons = ({file}: FileActionsButtonsProps) => {
    return (
        <div
            className="absolute -bottom-full right-2 group-hover/item:bottom-2 transition-all flex gap-2 z-50">
            <Link className="p-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition"
                  href="#" title="Edit">
                <Pen size={18} className="text-white"/>
            </Link>
            <Link className="p-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition"
                  href={file.url} target="_blank" title="View">
                <Eye size={18} className="text-white"/>
            </Link>
            <div className="p-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition">
                <Trash size={18} className="text-red-500"/>
            </div>
        </div>
    );
};
