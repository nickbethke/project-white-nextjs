"use client";

import {Toaster} from "react-hot-toast";

export const ToastProvider = () => {
    return <Toaster toastOptions={
        {
            position: 'bottom-right'
        }
    }/>
}
