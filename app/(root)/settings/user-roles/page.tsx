import {redirect} from "next/navigation";
import {Permissions} from "@/lib/user";
import {ChevronRight} from "lucide-react";
import React from "react";
import {getUserSsr} from "@/lib/ssr/user";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import UserRolesPermissionsEditTable from "./components/user-roles-edit-table";
import {Separator} from "@/components/ui/separator";

export default async function UserRolesView() {
    const session = await getServerSession(authOptions);

    const user = await getUserSsr(session.user.id);

    if (!user || !user.permission(Permissions.user_role_read)) {
        redirect('/')
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> User Roles
            </h1>
            <p className="text-muted-foreground">Manage user roles and permissions.</p>
            {user.permission(Permissions.user_roles_update) && (
                <>
                    <Separator className="my-4"/>
                    <h2 className="text-xl font-bold">Permissions</h2>
                    <UserRolesPermissionsEditTable/>
                </>
            )}
        </div>
    );
}
