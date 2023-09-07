import {prismaDB} from "@/lib/prisma";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import React from "react";
import {ChevronRight} from "lucide-react";
import {Permissions} from "@/lib/user";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";

export async function generateMetadata({params}: { params: { groupId: string } }): Promise<Metadata> {
    const id = params.groupId;

    const group = await prismaDB.groups.findUnique({
        where: {
            id: id
        }
    });
    return {
        title: `Settings ▫️ Group ▫️ ${group?.name} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
        description: "Group description"
    };
}

const GroupViewPage = async ({params}: { params: { groupId: string } }) => {

    const auth = await checkSessionAndPermissions(Permissions.group_create);

    if (auth.error) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession)
            redirect('/auth/signin');
        else if (auth.error === ISessionCheckAndPermissionsError.noPermission)
            redirect('/settings');
    }


    const {groupId} = params;
    const group = await prismaDB.groups.findUnique({
        where: {
            id: groupId
        }
    });

    if (!group) {
        redirect('/settings');
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> Groups <ChevronRight
                className="w-6 h-6 text-muted-foreground"/> {group?.name}
            </h1>

        </div>
    );
}

export default GroupViewPage;
