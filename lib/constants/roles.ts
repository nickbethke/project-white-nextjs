import {user_role} from ".prisma/client";

export const Roles: Record<user_role, string> = {
    user: "User",
    admin: "Admin",
    superadmin: "Superadmin"
}
