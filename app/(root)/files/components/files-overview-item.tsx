"use client";

import {ApiFile} from "@/types/file";
import React from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {FilesOverviewItemImage} from "./item-types/image";
import {FilesOverviewItemVideo} from "./item-types/video";
import {FilesOverviewItemDocument} from "./item-types/document";
import {allowedDocumentTypes} from "@/lib/constants/filetypes.constants";
import {cva, VariantProps} from "class-variance-authority";
import {FilesOverviewItemAudio} from "./item-types/audio";

export const fileOverviewItemVariants = cva(
    "relative flex gap-2 items-center justify-center w-64 h-64 bg-center object-center object-cover overflow-hidden",
    {
        variants: {
            size: {
                xl: "h-64 w-64",
                lg: "h-48 w-48",
                md: "h-32 w-32",
                sm: "h-24 w-24",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

interface FileSelectItemProps extends VariantProps<typeof fileOverviewItemVariants> {
    file: ApiFile;
    selected?: boolean;
    onClick?: (file: ApiFile) => void;
}

export interface FileSelectItemTypeProps extends VariantProps<typeof fileOverviewItemVariants> {
    file: ApiFile;
}

export const FilesOverviewItem = ({file, selected, onClick, size}: FileSelectItemProps) => {
    const isImage = file.file_type.startsWith("image");
    const isDocument = allowedDocumentTypes.includes(file.file_type);
    const isVideo = file.file_type.startsWith("video");
    const isAudio = file.file_type.startsWith("audio");


    const preview = () => {
        if (isImage) return <FilesOverviewItemImage file={file} size={size}/>;

        if (isVideo) return <FilesOverviewItemVideo file={file} size={size}/>;

        if (isDocument) return <FilesOverviewItemDocument file={file} size={size}/>;

        if (isAudio) return <FilesOverviewItemAudio file={file} size={size}/>;
    }

    return (
        <Button variant="unStyled" size="none"
                className={cn("group/item rounded shadow border border-muted overflow-hidden", selected ? "ring" : "hover:border-muted-foreground")}
                onClick={() => {
                    onClick?.(file);
                }}>
            {preview()}
        </Button>
    );
};
