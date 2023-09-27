import React from "react";
import {fileOverviewItemVariants, FileSelectItemTypeProps} from "@/app/(root)/files/components/files-overview-item";
import {formatBytes} from "@/lib/numbers";
import {FileText, FileType} from "lucide-react";
import {allowedDocumentTypes} from "@/lib/constants/filetypes.constants";
import {FileActionsButtons} from "@/app/(root)/files/components/ui/file-actions-buttons";
import {FileInfo} from "@/app/(root)/files/components/ui/file-info";
import {cn} from "@/lib/utils";
import {VariantProps} from "class-variance-authority";

const sizes: Record<"xl" | "lg" | "md" | "sm", number> = {
    "xl": 128,
    "lg": 128,
    "md": 64,
    "sm": 32,
}


export const FilesOverviewItemDocument: React.FC<FileSelectItemTypeProps> = ({file, size}) => {

    const getIcon = () => {
        switch (file.file_type) {
            case "application/pdf":
            case "text/plain":
                return <FileText className="text-muted-foreground" size={sizes[size ?? "sm"]}/>;
            default:
                return <FileType className="text-muted-foreground" size={sizes[size ?? "sm"]}/>;
        }
    }
    return (
        <>
            <div
                className={cn(fileOverviewItemVariants({size}))}
                onDoubleClick={(event) => {
                    event.preventDefault();
                    window.open(file.url, "_blank");
                }}
            >
                {getIcon()}
                <FileActionsButtons file={file}/>
            </div>
            <FileInfo file={file} size={size}/>
        </>
    );
}
