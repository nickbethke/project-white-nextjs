import React from "react";
import {Input} from "@/components/ui/input";

type ImageResizerProps = {
    file: File;
    onResize: (file: File) => void;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({file, onResize}) => {
    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const maxWidth = 1000;
    const maxHeight = 1000;

    const ratio = React.useMemo(() => {
        if (width > 0 && height > 0) {
            return width / height;
        }
        return 0;
    }, [width, height]);

    React.useEffect(() => {
        if (width > 0 && height > 0) {
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                let newWidth = width;
                let newHeight = height;
                if (width > maxWidth) {
                    newWidth = maxWidth;
                    newHeight = newWidth / ratio;
                }
                if (height > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = newHeight * ratio;
                }
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx?.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob(blob => {
                    if (blob) {
                        const newFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        onResize(newFile);
                    }
                });
            }
        }
    }, [width, height, file, onResize]);

    React.useEffect(() => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            setWidth(img.width);
            setHeight(img.height);
        }
    }, [file]);

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
            <canvas ref={canvasRef} width={width} height={height}/>
        </div>
    );
};
