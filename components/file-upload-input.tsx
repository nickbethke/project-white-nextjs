import React, {useMemo} from "react";
import {ApiFile} from "@/types/file";
import {useDropzone} from "react-dropzone";
import axios, {AxiosError} from "axios";
import {Check, Loader} from "lucide-react";
import {cn} from "@/lib/utils";

type FileUploadInputProps = {
    onUploaded?: (files: ApiFile[]) => void;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({onUploaded}) => {

    const [files, setFiles] = React.useState<(File & { loading: boolean })[]>([]);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const uploadedFiles: ApiFile[] = [];

        setFiles(acceptedFiles.map(file => Object.assign(file, {
            loading: true
        })));

        // Do something with the files
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = async () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result;

                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await axios.post("/api/upload", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    );
                    uploadedFiles.push(res.data.data.file);
                    setFiles(files => files.map(f => {
                        if (f.name === file.name) {
                            return Object.assign(f, {
                                loading: false
                            });
                        }
                        return f;
                    }));

                } catch (e) {
                    if (e instanceof AxiosError)
                        console.log(e.response?.data.message);
                    console.log(e);
                }


            };
            reader.readAsArrayBuffer(file);
        });
        onUploaded?.(uploadedFiles);
    }, [onUploaded]);

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles,
    } = useDropzone({onDrop});

    const className: string = useMemo(() => {
        return [
            'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground w-full h-32 hover:border-accent-foreground cursor-pointer',
            isFocused ? 'focus-visible:ring-primary' : '',
            isDragAccept ? 'border-green-500' : '',
            isDragReject ? 'border-red-500' : ''
        ].join(' ');
    }, [isFocused, isDragAccept, isDragReject]);

    const preview = files.map((file) => (
        <li key={file.name}
            className={cn('flex justify-between items-center', file.loading ? "text-muted-foreground" : "")}>
            {file.name}
            {file.loading ? <Loader className="animate-spin" size={16}/> :
                <Check className="text-green-500" size={16}/>}
        </li>
    ));

    return (
        <div className="flex flex-col gap-4">
            <div {...getRootProps({className})}>
                <input {...getInputProps()} />
                <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
            </div>
            <aside className="flex flex-col gap-2 max-h-[25vh] overflow-y-auto">
                <ul>{preview.map((item) => item)}</ul>
            </aside>
        </div>
    );
};
