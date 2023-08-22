"use client";

import {Button} from "@/components/ui/button";
import {ArrowUp, Trash} from "lucide-react";
import React from "react";
import {AlertModalWithoutZustand} from "@/components/modals/alert-modal";
import axios from "axios";
import toast from "react-hot-toast";
import {notification_status} from "@prisma/client";
import {useRouter} from "next/navigation";

export function DeleteNotificationButton({id}: { id: string }) {

    const router = useRouter();

    const [promptOpen, setPromptOpen] = React.useState<boolean>(false);

    const prompt = () => {
        setPromptOpen(true);
    }

    const deleteNotification = async () => {
        setPromptOpen(false);
        try {
            const result = await axios.delete(`/api/notifications/${id}`);
            if (result.status === 200) {
                toast.success("Successfully deleted notification");
                router.refresh();

            } else {
                toast.error("Failed to delete notification");
            }
        } catch (e) {
            toast.error("Failed to delete notification");
        }

    }
    return (
        <>
            <AlertModalWithoutZustand
                isOpen={promptOpen}
                onClose={() => setPromptOpen(false)}
                onConfirm={deleteNotification}
                description={"Delete this notification?"}
            />
            <Button variant="ghost" size="icon" title="Delete" onClick={prompt}>
                <Trash/>
            </Button>
        </>
    );
}

export function ArchiveNotificationButton({id}: { id: string }) {
    const [promptOpen, setPromptOpen] = React.useState<boolean>(false);
    const router = useRouter();
    const prompt = () => {
        setPromptOpen(true);
    }

    const archiveNotification = async () => {
        setPromptOpen(false);
        try {
            const result = await axios.patch(`/api/notifications/${id}`, {status: notification_status.archived});
            if (result.status === 200) {
                toast.success("Successfully archived notification");
                router.refresh();
            } else {
                toast.error("Failed to [status] notification");
            }
        } catch (e) {
            toast.error("Failed to [status] notification");
        }
    }

    return (
        <>
            <AlertModalWithoutZustand
                isOpen={promptOpen}
                onClose={() => setPromptOpen(false)}
                onConfirm={archiveNotification}
                description={"Archive this notification?"}
            />
            <Button variant="ghost" title="Archive" onClick={prompt} className="w-full justify-start">
                Archive
            </Button>
        </>
    );

}

export function UnArchiveNotificationButton({id}: { id: string }) {
    const [promptOpen, setPromptOpen] = React.useState<boolean>(false);
    const router = useRouter();
    const prompt = () => {
        setPromptOpen(true);
    }

    const unarchiveNotification = async () => {
        setPromptOpen(false);
        try {
            const result = await axios.patch(`/api/notifications/${id}`, {status: notification_status.read});
            if (result.status === 200) {
                toast.success("Successfully unarchived notification");
                router.refresh();
            } else {
                toast.error("Failed to unarchive notification");
            }
        } catch (e) {
            toast.error("Failed to unarchive notification");
        }
    }

    return (
        <>
            <AlertModalWithoutZustand
                isOpen={promptOpen}
                onClose={() => setPromptOpen(false)}
                onConfirm={unarchiveNotification}
                description={"Unarchive this notification?"}
            />
            <Button variant="ghost" size="icon" title="Unarchive" onClick={prompt}>
                <ArrowUp/>
            </Button>
        </>
    );

}
