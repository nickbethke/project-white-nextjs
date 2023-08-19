"use client";

import {useSearchParams} from "next/navigation";
import Image from "next/image";
import {LoaderIcon} from "lucide-react";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";


const ActivationPage = () => {

    const searchParams = useSearchParams();

    const [activated, setActivated] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const activate = async () => {
            try {
                const result = await axios.post('/api/auth/activate', {
                    token,
                    email
                });

                if (result.data.status === 'success') {
                    setActivated(true);
                } else {
                    toast.error("Failed to activate your account.");
                    setActivated(false);
                }
            } catch (error) {
                toast.error("Failed to activate your account.");
                setActivated(false);
            }

        }

        activate();
    }, [token, email]);

    if (!token || !email) {
        return (
            <main className="text-center flex flex-col justify-center items-center gap-4 h-70vh">
                <Image src="/logo.png" width={60} height={60} alt="logo" className="mx-auto"/>
                <h1 className="text-6xl font-bold tracking-tighter">Activation Failed</h1>
                <p>Invalid activation link.</p>
            </main>
        )
    }

    if (!activated) {
        return (
            <main className="text-center flex flex-col justify-center items-center gap-4 h-70vh">
                <Image src="/logo.png" width={60} height={60} alt="logo" className="mx-auto"/>
                <h1 className="text-6xl font-bold tracking-tighter">Activating your account</h1>
                <p>Please wait while we activate your account.</p>
                <LoaderIcon className="w-12 h-12 animate-spin"/>
            </main>
        )
    }

    return (
        <main className="text-center flex flex-col justify-center items-center gap-4 h-70vh">
            <Image src="/logo.png" width={60} height={60} alt="logo" className="mx-auto"/>
            <h1 className="text-6xl font-bold tracking-tighter">Activation Successful</h1>
            <p>Your account has been activated.</p>
        </main>
    );
}

export default ActivationPage;
