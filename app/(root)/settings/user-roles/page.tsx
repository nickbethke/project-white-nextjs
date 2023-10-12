import {redirect} from "next/navigation";
import {Permissions} from "@/lib/user";
import {ChevronRight} from "lucide-react";
import React from "react";
import UserRolesPermissionsEditTable from "./components/user-roles-edit-table";
import {Separator} from "@/components/ui/separator";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";

export default async function UserRolesView() {

    const session_check = await checkSessionAndPermissions(Permissions.user_roles_read);
    if (session_check.error) {
        if (session_check.error === ISessionCheckAndPermissionsError.noSession) {
            redirect('/auth/signin');
        }
        if (session_check.error === ISessionCheckAndPermissionsError.noPermission) {
            redirect('/');
        }
        return null;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> User Roles
            </h1>
            <p className="text-muted-foreground">Manage user roles and permissions.</p>
            <Separator className="my-4"/>
            <h2 className="text-xl font-bold">Permissions</h2>
            <UserRolesPermissionsEditTable/>
        </div>
    );
}
