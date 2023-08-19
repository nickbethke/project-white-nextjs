import React from "react";
import CalendarEventModal from "@/components/modals/calendar-event-modal";

export const CalendarEventProvider = () => {

    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CalendarEventModal/>
        </>

    );
}
