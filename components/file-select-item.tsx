import React from "react";
import {FileType, getFileTypeEnum} from "@/lib/files";
import Image from "next/image";
import {ApiFile} from "@/types/file";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

type FileSelectItemProps = {
    file: ApiFile;
    selected?: boolean;
    onSelect?: (file: ApiFile) => void;
}
export const FileSelectItem: React.FC<FileSelectItemProps> = ({file, selected, onSelect}) => {
    const isImage = getFileTypeEnum(file.file_type) === FileType.Image;
    const isDocument = getFileTypeEnum(file.file_type) === FileType.Document;
    const isVideo = getFileTypeEnum(file.file_type) === FileType.Video;
    const isAudio = getFileTypeEnum(file.file_type) === FileType.Audio;

    const preview = () => {
        if (isImage) {
            return (
                <div className="flex gap-2 items-center">
                    <Image
                        src={file.url}
                        width={256}
                        height={256}
                        alt={file.file_name}
                        className="h-32 w-auto object-cover"
                    />
                </div>
            )
        }

        if (isVideo) {
            return (
                <div className="flex gap-2 items-center">
                    <video src={file.url} width={256} height={256}/>
                </div>
            )
        }

        if (isAudio) {
            return (
                <div className="flex gap-2 items-center">
                    <audio src={file.url} controls/>
                </div>
            )
        }

        if (isDocument) {
            if (file.file_type === "application/pdf") {
                return (
                    <iframe src={file.url} width={256} height={256}/>
                )
            }
            return (
                <div className="flex gap-2 items-center">
                    <span>Document:</span>
                    <span className="text-muted-foreground">{file.file_name}</span>
                </div>
            )
        }
        return null;
    }

    return (
        <Button variant="ghost"
                className={cn("flex flex-col border border-muted-foreground rounded bg-muted h-fit p-0 hover:bg-muted-foreground/20", selected && "ring")}
                onClick={() => {
                    onSelect?.(file);
                }}>
            <div className="flex gap-2 items-center px-2 py-1 border-b border-muted-foreground w-full max-h-32">
                <span className="text-xs">
                {file.file_name}
                </span>
            </div>
            <div className="flex gap-2 items-center">
                {preview()}
            </div>
        </Button>
    )
};
