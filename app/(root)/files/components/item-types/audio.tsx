import React from "react";
import {fileOverviewItemVariants, FileSelectItemTypeProps} from "@/app/(root)/files/components/files-overview-item";
import {FileActionsButtons} from "@/app/(root)/files/components/ui/file-actions-buttons";
import {FileInfo} from "@/app/(root)/files/components/ui/file-info";
import {cn} from "@/lib/utils";
import {FileAudio, Loader, Pause, Play, Square} from "lucide-react";
import {formatSeconds} from "@/lib/numbers";

const sizes: Record<"xl" | "lg" | "md" | "sm", number> = {
    "xl": 128,
    "lg": 128,
    "md": 64,
    "sm": 32,
}


export const FilesOverviewItemAudio: React.FC<FileSelectItemTypeProps> = ({file, size}) => {

    const audioRef = React.useRef<HTMLAudioElement>(null);

    const [duration, setDuration] = React.useState<number>(0);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [currentTime, setCurrentTime] = React.useState<number>(0);


    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('loadeddata', (evt) => {
                setLoaded(true);
                setDuration(audioRef.current ? audioRef.current.duration : 0);
            });

            audioRef.current.addEventListener('play', (evt) => {
                setPlaying(true);
            });

            audioRef.current.addEventListener('pause', (evt) => {
                setPlaying(false);
            });

            audioRef.current.addEventListener('timeupdate', (evt) => {
                setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0);
            });
        }
    }, [audioRef.current]);

    return (
        <>
            <audio hidden ref={audioRef} src={file.url} controls/>
            <div
                className={cn(fileOverviewItemVariants({size}))}
                onDoubleClick={(event) => {
                    event.preventDefault();
                    window.open(file.url, "_blank");
                }}
            >
                <FileAudio className="text-muted-foreground" size={sizes[size ?? "sm"]}/>

                {loaded ? (
                    <div className="absolute w-full top-0 left-0 flex items-center justify-between gap-2 p-2">
                        <div className="flex gap-1 items-center">
                            {!playing ? (
                                <Play size={24} onClick={async () => {
                                    await audioRef.current?.play();
                                }}/>
                            ) : (
                                <Pause size={24} className="text-green-300"  onClick={() => {
                                    audioRef.current?.pause();
                                }}/>
                            )}
                            <Square size={24} onClick={() => {
                                audioRef.current?.pause();
                                if (audioRef.current)
                                    audioRef.current.currentTime = 0;
                            }}/>
                        </div>
                        <span
                            className="text-white text-xs px-2 py-1 rounded">{formatSeconds(currentTime)} / {formatSeconds(duration)}</span>
                    </div>
                ) : (
                    <div className="absolute top-0 left-0 w-full p-2 flex items-center justify-center">
                        <Loader className="animate-spin" size={24}/>
                    </div>
                )}

                <FileActionsButtons file={file}/>
            </div>
            <FileInfo file={file} size={size}/>
        </>
    );
}
