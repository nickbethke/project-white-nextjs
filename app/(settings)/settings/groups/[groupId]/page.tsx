import {prismaDB} from "@/lib/prisma";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import React from "react";
import {ChevronRight} from "lucide-react";

export async function generateMetadata({params}: { params: { groupId: string } }): Promise<Metadata> {
    // read route params
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
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> Groups <ChevronRight className="w-6 h-6 text-muted-foreground"/> {group?.name}
            </h1>

        </div>
    );
}

export default GroupViewPage;
