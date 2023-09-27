"use client";

import {FileSelectItemTypeProps} from "../files-overview-item";
import React from "react";
import Link from "next/link";
import {Eye, Pen, Trash} from "lucide-react";
import Image from "next/image";
import {FileInfo, IFileInfoResponse} from "@/types/axios-responses";
import axios from "axios";
import {formatBytes} from "@/lib/numbers";
import {cn} from "@/lib/utils";


export const FilesOverviewItemImage: React.FC<FileSelectItemTypeProps> = ({file}) => {

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

    return (
        <>
            <div
                className="relative flex gap-2 items-center justify-center w-64 h-64 bg-center object-center object-cover overflow-hidden"
                onDoubleClick={(event) => {
                    event.preventDefault();
                    window.open(file.url, "_blank");
                }}
            >
                {info && "file_dimensions" in info && (
                    <div className="absolute top-2 right-2 bg-black opacity-75">
                    <span
                        className="text-white text-xs px-2 py-1 rounded">{info?.file_dimensions?.width}x{info?.file_dimensions?.height}</span>
                    </div>
                )}
                <div
                    className="absolute -bottom-full right-2 group-hover/item:bottom-2 transition-all flex gap-2 z-50">
                    <Link className="p-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition"
                          href="#" title="Edit">
                        <Pen size={20} className="text-white"/>
                    </Link>
                    <Link className="p-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition"
                          href={file.url} target="_blank" title="View">
                        <Eye size={20} className="text-white"/>
                    </Link>
                    <div className="p-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition">
                        <Trash size={20} className="text-red-500"/>
                    </div>
                </div>
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs">Loading...</span>
                    </div>
                )}
                <Image
                    ref={imageRef}
                    src={file.url}
                    width={256}
                    height={256}
                    alt={file.file_name}
                    className={cn('h-64 w-64 object-cover object-center', !imageLoaded && 'opacity-0')}
                />
            </div>
            <div className="flex flex-col gap-2 p-4">
                <span
                    className="text-sm font-bold">{file.file_name.length > 20 ? file.file_name.slice(0, 20) + "..." : file.file_name}</span>
                <span className="text-xs text-muted-foreground">{file.file_type}</span>
                <span className="text-xs text-muted-foreground">{formatBytes(file.file_size)}</span>
            </div>
        </>
    )
};
