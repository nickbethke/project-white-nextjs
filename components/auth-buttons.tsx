"use client";

import {signIn, signOut} from "next-auth/react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import toast from "react-hot-toast";

export const LoginButton = () => {
    return (
        <Button variant="ghost" onClick={() => signIn()}>
            Sign in
        </Button>
    );
};

export const RegisterButton = () => {
    return (
        <Link href="/auth/register">
            <Button variant="ghost">Register</Button>
        </Link>
    );
};

export const LogoutButton = () => {
    return (
        <Button variant="ghost" onClick={() => {
            signOut();
            toast.success("Successfully logged out.");
        }}>
            Sign Out
        </Button>
    );
};

export const ProfileButton = () => {
    return <Link href="/profile">
        <Button variant="ghost">Profile</Button>
    </Link>;
};
