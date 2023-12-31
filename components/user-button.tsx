import React from "react";
import {authOptions} from "@/lib/auth";
import {Skeleton} from "@/components/ui/skeleton";
import {getServerSession} from "next-auth";
import Link from "next/link";
import {UserProfilePicture} from "@/components/user-profile-picture";
import {getUserSsr} from "@/lib/ssr/user";

export const UserButton = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <Skeleton className="w-20 h-20 rounded-full"/>;
    }

    const user = await getUserSsr(session.user.id);

    if (!user) {
        return <Skeleton className="w-20 h-20 rounded-full"/>;
    }


    return (
        <Link href="/profile">
            <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="flex-shrink-0">
                    <UserProfilePicture user={user}/>
                </div>
                <div className="hidden lg:block">
                    <div className="text-sm font-medium text-accent-foreground">
                        {session.user.username}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        {session.user.email}
                    </div>
                </div>
            </div>
        </Link>
    );

}
