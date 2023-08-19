import {Navbar} from "@/components/navbar";
import {Sidebar} from "@/components/sidebar";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import axios from "axios";
import {prismaDB} from "@/lib/prisma";
import {AlertPromptProvider} from "@/providers/alert-prompt-provider";

export default async function Layout({children}: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/auth/signin');
    }

    const user = await prismaDB.users.findUnique({
        where: {
            id: session.user.id
        }
    });

    if (!user) {
        redirect('/auth/signin');
    }

    if (user.activation_token) {
        redirect('/auth/activate');
    }

    return (
        <>
            <AlertPromptProvider/>
            <div className="">
                <div className="fixed top-16 left-0 w-0 md:w-64 xl:w-72 2xl:w-80 z-50">
                    <Sidebar/>
                </div>
                <div className="ml-0 md:ml-64 xl:ml-72 2xl:ml-80">
                    <Navbar/>
                    <div className="mt-16">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}