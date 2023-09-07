import {cn} from "@/lib/utils";
import {Badge, BadgeVariant} from "@/components/ui/badge";
import {DefaultUserRole} from "@/types/user";
import {user_roles} from "@prisma/client";


const badgeVariants: Record<DefaultUserRole, BadgeVariant> = {
    [DefaultUserRole.superadmin]: "destructive",
    [DefaultUserRole.admin]: "warning",
    [DefaultUserRole.user]: "secondary",
    [DefaultUserRole.developer]: "secondary",
}

export function RoleBadge({role}: {
    role: user_roles
}) {
    return (
        <Badge variant={badgeVariants[role.name as DefaultUserRole]} className={cn("text-sm")}>
            {role.readable_name}
        </Badge>
    )
}
