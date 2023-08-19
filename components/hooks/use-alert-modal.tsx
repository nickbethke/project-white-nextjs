import {create} from 'zustand';

interface UseAlertModalStore {
    isOpen: boolean;
    onOpen: Function;
    onClose: () => void;
    onConfirm: () => void;
}

export const useAlertModal = create<UseAlertModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    onConfirm: () => set({isOpen: false}),
}));
