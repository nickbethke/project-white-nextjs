import {formatBytes} from "@/lib/numbers";
import React from "react";
import {ApiFile} from "@/types/file";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

export const fileOverviewItemInfoVariants = cva(
    "flex flex-col gap-2 p-4 overflow-hidden",
    {
        variants: {
            size: {
                xl: "w-64",
                lg: "w-48",
                md: "w-32",
                sm: "w-24",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

export const fileOverviewItemInfoTextVariants = cva(
    "font-bold",
    {
        variants: {
            size: {
                xl: "",
                lg: "text-sm",
                md: "text-sm",
                sm: "text-xs",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

interface FileInfoProps extends VariantProps<typeof fileOverviewItemInfoVariants> {
    file: ApiFile;
}

export const FileInfo = ({file, size}: FileInfoProps) => {

    // add &shy; to file name every 10 characters
    const name = file.file_name.replace(/(.{10})/g, "$1&thinsp;");

    const moreInfoHidden = size === "sm" || size === "md";
    return (
        <div className={cn(fileOverviewItemInfoVariants({size}))}>
            <span className={cn(fileOverviewItemInfoTextVariants({size}))} dangerouslySetInnerHTML={{__html: name}}/>
            {!moreInfoHidden && (
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{file.file_type}</span>
                    <span className="text-xs text-muted-foreground">{formatBytes(file.file_size)}</span>
                </div>
            )}
        </div>
    );
};
