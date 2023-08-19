import {prismaDB} from "@/lib/prisma";
import {notification_type} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import InboxSidebar from "@/app/(root)/inbox/components/inbox-sidebar";
import {DataTable} from "@/app/(root)/inbox/components/data-table";
import {notificationColumns} from "@/app/(root)/inbox/components/columns";
import {Separator} from "@/components/ui/separator";

export default async function InboxSend() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div>loading...</div>;
    }

    const notifications = await prismaDB.notifications.findMany({
        where: {
            from_id: session.user.id,
        },
        include: {
            from: true,
            to: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="">
            <div className="p-4 mr-0 md:mr-64 xl:mr-72 2xl:mr-80">
                <h1 className="text-2xl font-bold flex gap-2 items-baseline">
                    Inbox - Sent
                </h1>
                <Separator/>
                <DataTable send columns={notificationColumns} data={notifications}/>
            </div>
            <InboxSidebar send type={"all"} status={"all"}/>
        </div>
    )
}
