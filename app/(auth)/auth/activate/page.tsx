"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const ActivatePage = () => {

    const onSubmit = async () => {
        try {
            const result = await axios.post('/api/mail/activation');

            if (result.data.status === 'success') {
                toast.success("Successfully sent activation link.");
            } else {
                toast.error("Failed to send activation link.");
            }
        } catch (e) {
            if (axios.isAxiosError(e) && e.response && e.response.status === 301) {
                toast.error("Your account has already been activated.");
            } else {
                toast.error("Failed to send activation link.");
            }
        }

    }

    return (
        <main className="text-center flex flex-col justify-center items-center gap-4 h-70vh">
            <Image src="/logo.png" width={60} height={60} alt="logo" className="mx-auto"/>
            <h1 className="text-2xl font-bold">Activate your account</h1>
            <p>Your has not been activated yet. Please check your email for the activation link.</p>
            <Button onClick={onSubmit} variant="link">Resend activation link</Button>
        </main>
    )
}

export default ActivatePage;
