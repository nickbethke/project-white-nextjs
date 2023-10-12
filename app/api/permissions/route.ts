import {Prisma} from ".prisma/client";
import {Permissions, ReadablePermissions} from "@/lib/user";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";

export async function GET() {

    const session_check = await checkSessionAndPermissions([Permissions.user_role_permission_read]);

    if (session_check.error) {
        switch (session_check.error) {
            case ISessionCheckAndPermissionsError.noSession:
                return getErrorResponse(401, "Unauthorized");
            case ISessionCheckAndPermissionsError.noPermission:
                return getErrorResponse(403, "Forbidden");
        }
    }

    const permissions = await prismaDB.permissions.findMany();

    return getResponse(200, "Permissions", {
        permissions: permissions.map((permission) => {
            return {
                id: permission.id,
                name: permission.name,
                readable_name: permission.readable_name,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt,
            }
        }),
    });
}

export async function PATCH() {

    const session_check = await checkSessionAndPermissions([Permissions.user_role_permission_read, Permissions.user_role_permission_update, Permissions.user_role_permission_create, Permissions.user_role_permission_delete]);

    if (session_check.error) {
        switch (session_check.error) {
            case ISessionCheckAndPermissionsError.noSession:
                return getErrorResponse(401, "Unauthorized");
            case ISessionCheckAndPermissionsError.noPermission:
                return getErrorResponse(403, "Forbidden");
        }
    }

    const permissions: Prisma.permissionsCreateWithoutUser_role_permissionsInput[] = Object.keys(Permissions).map((key) => {
        return {
            name: key,
            readable_name: ReadablePermissions[key as Permissions],
        }
    });

    const dbPermissions = await prismaDB.permissions.findMany();

    // find missing permissions
    const missingPermissions = permissions.filter((permission) => {
        return !dbPermissions.find((dbPermission) => dbPermission.name === permission.name);
    });

    // find removed permissions
    const toRemovedPermissions = dbPermissions.filter((dbPermission) => {
        return !permissions.find((permission) => permission.name === dbPermission.name);
    });

    const removedPermissions = await prismaDB.permissions.deleteMany({
            where: {
                id: {
                    in: toRemovedPermissions.map(p => p.id)
                }
            }
        }
    )
    // create missing permissions
    const createdPermissions = await prismaDB.permissions.createMany({
        data: missingPermissions,
    });

    return getResponse(200, "Permissions created", {
        created: createdPermissions.count,
        deleted: removedPermissions.count
    });
}
