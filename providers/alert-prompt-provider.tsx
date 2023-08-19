"use client";

import React from "react";
import {AlertModal} from "@/components/modals/alert-modal";

export const AlertPromptProvider = () => {
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AlertModal/>
        </>
    );
}
