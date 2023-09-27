import React from "react";
import {Input} from "@/components/ui/input";
import NextImage from "next/image";
import axios from "axios";
import {IFileInfoResponse} from "@/types/axios-responses";

type ImageResizerProps = {
    file: File;
    onResize: (file: File, width: number, height: number, pivotX: number, pivotY: number) => void;
}

export const ProfileImageResizer: React.FC<ImageResizerProps> = ({file, onResize}) => {
    const imageRef = React.useRef<HTMLImageElement>(null);
    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);
    const [pivotX, setPivotX] = React.useState<number>(0);
    const [pivotY, setPivotY] = React.useState<number>(0);

    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const [maxDimension, setMaxDimension] = React.useState<{ width: number, height: number }>({
        width: 0,
        height: 0
    });

    const profileImageWidth = 256;
    const profileImageHeight = 256;


    React.useEffect(() => {
        // default js info
        (async () => {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const {data} = await axios.post<IFileInfoResponse>("/api/upload/info", formData);
                if ("file_dimensions" in data.data.fileInfo) {
                    const {width, height} = data.data.fileInfo.file_dimensions;
                    setWidth(width);
                    setHeight(height);
                    setPivotX(width / 2);
                    setPivotY(height / 2);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, [file]);

    React.useEffect(() => {
        const windowDimension = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        const maxDimension = {
            width: windowDimension.width - 100,
            height: windowDimension.height - 100
        };
        setMaxDimension(maxDimension);
    }, [width, height]);

    React.useEffect(() => {
        // selection area is a circle with radius of profileImageWidth / 2
        // selection area is centered on the canvas but can be moved around

        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const image = imageRef.current;
        if (!image) {
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, profileImageWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(image, 0, 0, width, height);
    }, [pivotX, pivotY, width, height]);

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-2 items-center">
                <span>Width:</span>
                <Input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value))}/>
            </div>
            <div className="flex gap-2 items-center">
                <span>Height:</span>
                <Input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value))}/>
            </div>
            <div className="relative">
                <NextImage src={URL.createObjectURL(file)} alt="image" ref={imageRef} width={width} height={height}/>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <canvas ref={canvasRef} width={width} height={height}/>
                </div>
            </div>

        </div>
    );
};
