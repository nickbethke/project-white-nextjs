import {create} from 'zustand';
import {ICalendarEvent} from "@/components/calendar/interfaces/calendar-overview-interfaces";

interface UseCalendarEventModalStore {
    isOpen: boolean;
    open: (isOpen: boolean) => void;
    calenderEntry: ICalendarEvent | undefined;
    setCalenderEntry: (calenderEntry: ICalendarEvent | undefined) => void;
}

export const useCalendarEventModalStore = create<UseCalendarEventModalStore>((set) => ({
    isOpen: false,
    open: (isOpen: boolean) => set({isOpen}),
    calenderEntry: undefined,
    setCalenderEntry: (calenderEntry: ICalendarEvent | undefined) => set({calenderEntry})
}));
