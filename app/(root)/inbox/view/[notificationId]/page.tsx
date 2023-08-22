import {ChevronRight} from "lucide-react";
import {redirect} from "next/navigation";
import {prismaDB} from "@/lib/prisma";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import React from "react";
import {Metadata} from "next";
import ReactMarkdown from "react-markdown";

export function generateMetadata(): Metadata {
    return {
        title: `Inbox ▫️ Notification |️ ${process.env.NEXT_PUBLIC_APP_NAME}`,
        description: 'Inbox',
    }
}

export default async function NotificationViewPage({params}: { params: { notificationId: string } }) {

    const notification = await prismaDB.notifications.findUnique({
        where: {
            id: params.notificationId
        },
        include: {
            from: true,
            to: true
        }
    })

    if (!notification) {
        redirect('/inbox');
    }

    await prismaDB.notifications.update({
        where: {
            id: params.notificationId
        },
        data: {
            status: 'read'
        }
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-baseline">
                <Link href="/inbox">Inbox</Link><ChevronRight size={16}/><span>Notification</span>
            </h1>
            <Separator/>
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>
                        {notification.subject}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2">
                            <div className="font-bold">From:</div>
                            <div>{notification.from.username} - {notification.from.email}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="font-bold">To:</div>
                            <div>{notification.to.username} - {notification.from.email}</div>
                        </div>
                    </div>
                    <Separator/>
                    <div className="p-4 border rounded-md">
                        <iframe src={`/notifications/${notification.id}/renderContent`}
                                className="w-full min-h-[50vh] border-0 bg-background"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
