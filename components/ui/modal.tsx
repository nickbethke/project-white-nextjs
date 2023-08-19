"use client";

import React from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";

interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: Function;
    children?: React.ReactNode;

}

export const Modal: React.FC<ModalProps> = ({title, description, isOpen, onClose, children}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogBody>
                    {children}
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}
