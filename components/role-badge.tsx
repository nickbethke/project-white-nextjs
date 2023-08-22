import {cn} from "@/lib/utils";
import {Roles} from "@/lib/constants/roles";
import {Badge, BadgeVariant} from "@/components/ui/badge";
import {UserRole} from "@/types/user";
import {user_roles} from "@prisma/client";


const badgeVariants: Record<UserRole, BadgeVariant> = {
    [UserRole.superadmin]: "destructive",
    [UserRole.admin]: "warning",
    [UserRole.user]: "secondary",
}

export function RoleBadge({role}: {
    role: user_roles
}) {
    return (
        <Badge variant={badgeVariants[role.name as UserRole]} className={cn("text-sm")}>
            {role.readable}
        </Badge>
    )
}
