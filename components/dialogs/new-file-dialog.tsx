"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button, buttonVariants} from "@/components/ui/button";
import {File} from "lucide-react";
import {VariantProps} from "class-variance-authority";
import {FileUploadInput} from "@/components/file-upload-input";
import {ApiFile} from "@/types/file";

type FileSelectDialogProps = {
    buttonVariant: VariantProps<typeof buttonVariants>["variant"];
    text?: string;
    onUploaded?: (files: ApiFile[]) => void;
}

export const NewFileDialog = ({buttonVariant, text, onUploaded}: FileSelectDialogProps) => {

    const [open, setOpen] = React.useState(false);


    const onOpenChange = (open: boolean) => {
        setOpen(open);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} onClick={() => setOpen(true)}>
                    <File className="w-6 h-6 mr-2"/> {text ?? "Upload file"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{text ?? "Upload file"}</DialogTitle>
                    <DialogDescription className="flex gap-2 items-center justify-end">
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <FileUploadInput onUploaded={(files) => {
                        onUploaded?.(files);
                        setOpen(false);
                    }}/>
                </div>
            </DialogContent>
        </Dialog>
    );
};

