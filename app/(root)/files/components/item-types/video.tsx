import React from "react";
import {FileSelectItemTypeProps} from "@/app/(root)/files/components/files-overview-item";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Eye, Pen, Trash} from "lucide-react";
import {formatBytes} from "@/lib/numbers";

export const FilesOverviewItemVideo: React.FC<FileSelectItemTypeProps> = ({file}) => {

    const [videoLoaded, setVideoLoaded] = React.useState<boolean>(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);


    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', () => {
                setVideoLoaded(true);
            });
        }
    }, [videoRef.current]);


    return (
        <>
            <div
                className="relative flex gap-2 items-center justify-center w-64 h-64 bg-center object-center object-cover overflow-hidden"
                onDoubleClick={(event) => {
                    event.preventDefault();
                    window.open(file.url, "_blank");
                }}
            >
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
                {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs">Loading...</span>
                    </div>
                )}
                <video
                    src={file.url}
                    width={256}
                    height={256}
                    ref={videoRef}
                    controls={false}
                    className={cn('h-64 w-64 object-cover object-center', !videoLoaded && 'opacity-0')}
                    onContextMenu={(event) => {
                        event.preventDefault();
                    }}/>
            </div>
            <div className="flex flex-col gap-2 p-4">
                <span
                    className="text-sm font-bold">{file.file_name.length > 20 ? file.file_name.slice(0, 20) + "..." : file.file_name}</span>
                <span className="text-xs text-muted-foreground">{file.file_type}</span>
                <span className="text-xs text-muted-foreground">{formatBytes(file.file_size)}</span>
            </div>
        </>
    );
}
