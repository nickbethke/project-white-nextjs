"use client";

import {DashboardItem} from "@/components/dashboard/dashboard-item";
import {Mail, MailOpen, MessageCircleIcon} from "lucide-react";
import React from "react";
import {notifications} from ".prisma/client";
import axios from "axios";
import {ApiNotification, INotificationsResponse} from "@/types/axios-responses";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Gravatar from "@/components/gravatar";
import {dateTimeFormatted} from "@/lib/utils";

export function NotificationOverviewDashboard() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [notifications, setNotifications] = React.useState<ApiNotification[]>([]);

    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            await requestNotifications();
        })();
    }, []);

    const requestNotifications = async () => {
        setLoading(true)
        try {
            const response = await axios.get<INotificationsResponse>('/api/notifications');
            setNotifications(response.data.data.notifications);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    }


    return (
        <DashboardItem title="Notifications" description="Manage notifications"
                       icon={<MessageCircleIcon className="w-6 h-6"/>}>
            {loading && <p>Loading...</p>}
            {!loading && notifications.length === 0 && <p>No notifications</p>}
            {!loading && notifications.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {notifications.map((notification) => (
                        <Button
                            variant="outline"
                            key={notification.id}
                            onClick={() => {
                                router.push(`/inbox/view/${notification.id}`)
                            }}
                            className="flex gap-2 p-4 h-auto justify-start items-center"
                        >
                            {notification.status === 'unread' ? (<Mail className="w-6 h-6"/>) : (
                                <MailOpen className="w-6 h-6"/>)}
                            <Gravatar email={notification.from.email} size={32}/>
                            <p className="font-bold">{notification.from.username}</p>
                            <p className="text-sm text-muted-foreground">{notification.subject}</p>
                            <p className="ml-auto text-sm text-muted-foreground">{dateTimeFormatted(notification.createdAt)}</p>
                        </Button>
                    ))}
                </div>
            )}
        </DashboardItem>
    );
}
