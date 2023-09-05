import {getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {Prisma} from ".prisma/client";

export async function GET() {

    const superAdminPermission: Prisma.user_role_permissionsCreateWithoutUser_roleInput = {
        own_profile_update: true,
        own_profile_delete: true,
        user_create: true,
        user_read: true,
        user_update: true,
        user_delete: true,
        user_role_create: true,
        user_role_read: true,
        user_role_update: true,
        user_role_delete: true,
        user_role_permission_create: true,
        user_role_permission_read: true,
        user_role_permission_update: true,
        user_role_permission_delete: true,
        notification_create: true,
        notification_read: true,
        notification_update: true,
        notification_delete: true,
        option_create: true,
        option_read: true,
        option_update: true,
        option_delete: true,
        calendar_event_create: true,
        calendar_event_read: true,
        calendar_event_update: true,
        calendar_event_delete: true,
        group_create: true,
        group_read: true,
        group_update: true,
        group_delete: true,
        group_member_create: true,
        group_member_read: true,
        group_member_update: true,
        group_member_delete: true,
    }
    if (!await prismaDB.user_roles.findUnique({where: {name: "SuperAdmin"}})) {
        await prismaDB.user_roles.create({
            data: {
                name: "SuperAdmin",
                readable: "Super Administrator",
                permissions: {
                    create: {
                        ...superAdminPermission
                    }
                }
            }
        });
    }
    const adminPermission: Prisma.user_role_permissionsCreateWithoutUser_roleInput = {
        ...superAdminPermission
        , ...{
            user_role_create: false,
            user_role_read: false,
            user_role_update: false,
            user_role_delete: false,
            user_role_permission_create: false,
            user_role_permission_read: false,
            user_role_permission_update: false,
            user_role_permission_delete: false,
        }
    }

    if (!await prismaDB.user_roles.findUnique({where: {name: "Admin"}})) {
        await prismaDB.user_roles.create({
            data: {
                name: "Admin",
                readable: "Administrator",
                permissions: {
                    create: {
                        ...adminPermission
                    }
                }
            }
        });
    }


    const developerPermission: Prisma.user_role_permissionsCreateWithoutUser_roleInput = {
        ...adminPermission
        , ...{
            user_create: true,
            user_read: true,
            user_update: false,
            user_delete: false,
            group_create: true,
            group_read: false,
            group_update: false,
            group_delete: false,
            group_member_create: false,
            group_member_read: false,
            group_member_update: false,
            group_member_delete: false,
        }
    }

    if (!await prismaDB.user_roles.findUnique({where: {name: "Developer"}})) {
        await prismaDB.user_roles.create({
            data: {
                name: "Developer",
                readable: "Developer",
                permissions: {
                    create: {
                        ...developerPermission
                    }
                }
            }
        });
    }

    const userPermission: Prisma.user_role_permissionsCreateWithoutUser_roleInput = {
        ...adminPermission
        , ...{
            user_create: false,
            user_read: false,
            user_update: false,
            user_delete: false,

        }
    }

    if (!await prismaDB.user_roles.findUnique({where: {name: "User"}})) {
        await prismaDB.user_roles.create({
            data: {
                name: "User",
                readable: "User",
                permissions: {
                    create: {
                        ...userPermission
                    }
                }
            }
        });
    }

    return getResponse(200, "OK", null);
}
