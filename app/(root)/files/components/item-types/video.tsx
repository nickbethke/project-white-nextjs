import React from "react";
import {fileOverviewItemVariants, FileSelectItemTypeProps} from "@/app/(root)/files/components/files-overview-item";
import {cn} from "@/lib/utils";
import {formatSeconds} from "@/lib/numbers";
import {FileActionsButtons} from "@/app/(root)/files/components/ui/file-actions-buttons";
import {FileInfo as FIComponent} from "../ui/file-info";

export const FilesOverviewItemVideo: React.FC<FileSelectItemTypeProps> = ({file, size}) => {

    const [videoLoaded, setVideoLoaded] = React.useState<boolean>(false);
    const [duration, setDuration] = React.useState<number>(0);
    const videoRef = React.useRef<HTMLVideoElement>(null);


    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', (evt) => {
                setVideoLoaded(true);
                setDuration(videoRef.current ? videoRef.current.duration : 0);
            });
        }
    }, [videoRef.current]);

    console.log(duration);

    return (
        <>
            <div
                className={cn(fileOverviewItemVariants({size}))}
                onDoubleClick={(event) => {
                    event.preventDefault();
                    window.open(file.url, "_blank");
                }}
            >
                {duration && duration > 0 && (
                    <div className="absolute top-2 right-2 bg-black opacity-75">
                    <span
                        className="text-white text-xs px-2 py-1 rounded">{formatSeconds(duration)}</span>
                    </div>
                )}
                <FileActionsButtons file={file}/>
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
            <FIComponent file={file} size={size}/>
        </>
    );
}
