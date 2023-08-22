import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {DataTable} from "./components/data-table";
import {notificationColumns} from "./components/columns"
import {prismaDB} from "@/lib/prisma";
import InboxSidebar from "@/app/(root)/inbox/components/inbox-sidebar";
import {Separator} from "@/components/ui/separator";
import {Metadata} from "next";

export function generateMetadata(): Metadata {
    return {
        title: `Inbox | ${process.env.NEXT_PUBLIC_APP_NAME}`,
        description: 'Inbox',
    }
}

export default async function Inbox() {

    const session = await getServerSession(authOptions);
    if (!session) {
        return <div>loading...</div>;
    }

    // status not archived
    const notifications = await prismaDB.notifications.findMany({
        where: {
            to_id: session.user.id,
            NOT: {
                status: 'archived'
            }
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
                    Inbox
                    <span className="text-sm text-gray-500">- {session.user.username}</span>
                </h1>
                <Separator/>
                <DataTable columns={notificationColumns} data={notifications}/>
            </div>
            <InboxSidebar/>
        </div>
    )
}
