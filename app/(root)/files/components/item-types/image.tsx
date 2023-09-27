"use client";

import {fileOverviewItemVariants, FileSelectItemTypeProps} from "../files-overview-item";
import React from "react";
import Image from "next/image";
import {FileInfo, IFileInfoResponse} from "@/types/axios-responses";
import axios from "axios";
import {cn} from "@/lib/utils";
import {FileActionsButtons} from "@/app/(root)/files/components/ui/file-actions-buttons";
import {FileInfo as FIComponent} from "../ui/file-info";
import {cva} from "class-variance-authority";

export const fileOverviewItemImageVariants = cva(
    "object-cover object-center",
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


export const FilesOverviewItemImage: React.FC<FileSelectItemTypeProps> = ({file, size}) => {

    const [info, setInfo] = React.useState<FileInfo | null>(null);

    React.useEffect(() => {
        (async () => {
            await loadInfo();
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            await loadInfo();
        })();
    }, [file]);


    const loadInfo = async () => {
        try {
            const res = await axios.get<IFileInfoResponse>(`/api/files/${file.id}/info`);
            setInfo(res.data.data.fileInfo);
        } catch (e) {
            console.log(e);
        }
    }

    // ad lazyloding to image

    const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

    const imageRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        if (imageRef.current) {
            console.log("imageRef.current", imageRef.current);
            imageRef.current.addEventListener('load', () => {
                setImageLoaded(true);
            });
        }
    }, [imageRef.current]);

    const moreInfoShown = size === "lg" || size === "xl";

    return (
        <>
            <div
                className={cn(fileOverviewItemVariants({size}))}
                onDoubleClick={(event) => {
                    event.preventDefault();
                    window.open(file.url, "_blank");
                }}
            >
                {info && moreInfoShown && "file_dimensions" in info && (
                    <div className="absolute top-2 right-2 bg-black opacity-75">
                    <span
                        className="text-white text-xs px-2 py-1 rounded">{info?.file_dimensions?.width}x{info?.file_dimensions?.height}</span>
                    </div>
                )}
                <FileActionsButtons file={file}/>
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs">Loading...</span>
                    </div>
                )}
                <img
                    ref={imageRef}
                    src={file.url}
                    width={256}
                    height={256}
                    alt={file.file_name}
                    className={cn(fileOverviewItemImageVariants({size}), !imageLoaded && 'opacity-0')}
                />
            </div>
            <FIComponent file={file} size={size}/>
        </>
    )
};
