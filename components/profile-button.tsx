import {ApiUser} from "@/types/user";
import Gravatar from "@/components/gravatar";
import Link from "next/link";
import React from "react";
import axios from "axios";
import {IUserResponse} from "@/types/axios-responses";
import {Skeleton} from "@/components/ui/skeleton";
import toast from "react-hot-toast";

type ProfileButtonProps = {
    user_id: ApiUser['id']
}

export default function ProfileButton({user_id}: ProfileButtonProps) {

    const [user, setUser] = React.useState<ApiUser | null>(null);

    React.useEffect(() => {
        (async () => {
            try {
                const response = await axios.get<IUserResponse>(`/api/users/${user_id}`);
                setUser(response.data.data.user);
            } catch (e) {
                toast.error("Failed to fetch user");
            }
        })();
    }, [user_id]);

    if (!user) {
        return <Skeleton className="w-40 h-10 bg-accent-foreground/20"/>
    }

    return (
        <Link href={`/profile/${user.id}`}>
            <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="flex-shrink-0">
                    <Gravatar email={user.email} size={40} className="rounded-full"/>
                </div>
                <div className="hidden lg:block">
                    <div className="text-sm font-medium text-accent-foreground">
                        {user.username}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        {user.email}
                    </div>
                </div>
            </div>
        </Link>
    )
}
