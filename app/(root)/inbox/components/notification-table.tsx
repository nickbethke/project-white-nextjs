import React from "react";
import {User} from "@/types/user";
import {prismaDB} from "@/lib/prisma";
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

type Notification = {
    id: number
    type: string
    from_id: number
    to_id: number
    createdAt: Date
    updatedAt: Date
}

type NotificationTableProps = {
    user: User
}
export const NotificationTable: React.FC = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/signin');
    }

    const notifications = await prismaDB.notifications.findMany({
        where: {
            to_id: session.user.id
        },
        include: {
            from: true,
            to: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (!notifications) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 bg-accent-foreground">
            {notifications.map((notification) => (
                <div key={notification.id} className="flex flex-col gap-2">
                    <p className="text-gray-500">{notification.createdAt.getUTCDate()}</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-500">{notification.type}</p>
                        <p className="text-gray-500">{notification.content}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
