"use client";

import React, {useEffect} from "react";
import {Modal} from "@/components/ui/modal";
import {Button} from "@/components/ui/button";
import {useAlertModal} from "@/components/hooks/use-alert-modal";


export const AlertModal: React.FC = () => {
    const alertModal = useAlertModal();
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <Modal title="Are you sure?" isOpen={alertModal.isOpen} onClose={alertModal.onClose}
                   description="This action cannot be undone.">
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button variant="outline" onClick={alertModal.onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={alertModal.onConfirm}>
                        Continue
                    </Button>
                </div>
            </Modal>
        </>
    );
}

type AlertModalProps = {
    isOpen: boolean;
    onClose: Function;
    onConfirm: Function;
    description?: string;

}

export const AlertModalWithoutZustand: React.FC<AlertModalProps> = ({isOpen, onClose, onConfirm, description}) => {
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <Modal title="Are you sure?" isOpen={isOpen} onClose={onClose}
                   description={description || "This action cannot be undone."}>
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button variant="outline" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={() => onConfirm()}>
                        Continue
                    </Button>
                </div>
            </Modal>
        </>
    );
}
