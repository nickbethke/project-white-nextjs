import {MainNav} from "@/components/main-nav";
import React from "react";
import {UserButton} from "@/components/user-button";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {LogoutButton} from "@/components/auth-buttons";
import {ModeToggle} from "@/components/mode-toggle";
import Image from "next/image";
import Link from "next/link";

export async function Navbar() {
    const session = await getServerSession(authOptions);
    return (
        <div className="bg-muted border-b fixed top-0 left-0 w-screen z-50">
            <div className="flex h-16 items-center px-4">
                <Link href="/" className="flex items-center gap-4">
                    <Image src="/logo.png" alt="Logo" height={65 / 2} width={65 / 2}/>
                    <p className="text-2xl tracking-tighter">Project White</p>
                </Link>
                <div className="ml-auto flex items-center gap-4">
                    <ModeToggle/>
                    <UserButton/>
                    <LogoutButton/>
                </div>
            </div>
        </div>
    )
}
