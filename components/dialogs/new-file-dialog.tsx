"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button, buttonVariants} from "@/components/ui/button";
import {File, Plus, X} from "lucide-react";
import {VariantProps} from "class-variance-authority";
import axios from "axios";
import {IFilesResponse} from "@/types/axios-responses";
import {FileUploadInput} from "@/components/file-upload-input";
import {ApiFile} from "@/types/file";
import {FileSelectItem} from "@/components/file-select-item";
import {FileType} from "@/lib/files";

type FileSelectDialogProps = {
    buttonVariant: VariantProps<typeof buttonVariants>["variant"];
    text?: string;
    onFileSelect?: (file: ApiFile) => void;
    type?: FileType | FileType[];
}

export const FileSelectDialog = ({buttonVariant, text, onFileSelect, type}: FileSelectDialogProps) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const [loading, setLoading] = React.useState<boolean>(false);

    const [addFile, setAddFile] = React.useState<boolean>(false);

    const [files, setFiles] = React.useState<ApiFile[]>([]);

    const [selectedFile, setSelectedFile] = React.useState<ApiFile | null>(null);


    const loadFiles = async () => {
        try {
            if (type === undefined) {
                const response = await axios.get<IFilesResponse>("/api/files");
                setFiles(response.data.data.files);
                return;
            }
            if (Array.isArray(type)) {
                const response = await axios.get<IFilesResponse>("/api/files/type/" + type.join("|"));
                setFiles(response.data.data.files);
                return;
            }
            const response = await axios.get<IFilesResponse>("/api/files/type/" + type);
            setFiles(response.data.data.files);
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            await loadFiles();
            setLoading(false);
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            if (open) {
                setLoading(true);
                await loadFiles();
                setLoading(false);
            }
        })();
    }, [open]);

    const onOpenChange = (open: boolean) => {
        setOpen(open);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} onClick={() => setOpen(true)}>
                    <File className="w-6 h-6 mr-2"/> {text ?? "Select file"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{addFile ? "Add file" : "Select file"}</DialogTitle>
                    <DialogDescription className="flex gap-2 items-center justify-end">
                        {addFile && (
                            <Button
                                variant="destructive"
                                size="xs"
                                onClick={() => {
                                    setAddFile(false)
                                }}
                            >
                                <X className="w-4 h-4 mr-2"/> Cancel
                            </Button>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {addFile ? (
                    <div className="p-4">
                        <FileUploadInput onUpload={async (file) => {
                            setAddFile(false);
                            setLoading(true);
                            await loadFiles();
                            setLoading(false);
                        }
                        }/>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Button variant="ghost"
                                    className="flex flex-col border border-muted-foreground rounded bg-muted h-full hover:bg-muted-foreground/20"
                                    onClick={() => {
                                        setAddFile(true);
                                    }}
                            >
                                <div className="flex gap-2 items-center">
                                    <Plus className="w-6 h-6 mr-1"/>
                                    <span className="text-muted-foreground">
                                        Add file
                                    </span>
                                </div>
                            </Button>
                            {files.map((file) => {
                                return (
                                    <FileSelectItem
                                        key={file.id}
                                        file={file} selected={selectedFile?.id === file.id}
                                        onSelect={(file) => {
                                            if (selectedFile?.id === file.id) {
                                                setSelectedFile(null);
                                            } else {
                                                setSelectedFile(file);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                {!addFile && (
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setOpen(false);

                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="default"
                            onClick={() => {
                                setOpen(false);
                                onFileSelect?.(selectedFile!);
                            }}
                        >
                            Select
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

