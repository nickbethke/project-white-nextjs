"use client";

import React from "react";
import {ChevronRight} from "lucide-react";
import SettingsGroupsForm from "@/app/(root)/settings/components/settings-groups-form";
import {useUser} from "@/components/providers/user-provider";
import {Permissions} from "@/lib/user";
import {useRouter} from "next/navigation";

const GroupsPage = () => {
    const user = useUser();
    const router = useRouter();

    if (!user.permission(Permissions.group_read)) {
        router.push('/');
        return null;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> Groups
            </h1>
            <SettingsGroupsForm/>
        </div>
    );
}

export default GroupsPage;
