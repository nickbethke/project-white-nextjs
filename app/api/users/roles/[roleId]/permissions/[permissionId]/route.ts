import {NextRequest} from "next/server";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";
import {Permissions} from "@/lib/user";
import {getErrorResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";

export async function POST(req: NextRequest, {params: {roleId, permissionId}}: {
    params: {
        roleId: string
        permissionId: string
    }
}) {
    const auth = await checkSessionAndPermissions(Permissions.user_roles_update);

    if (auth.error) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession)
            return getErrorResponse(401, "Unauthorized");
        if (auth.error === ISessionCheckAndPermissionsError.noPermission)
            return getErrorResponse(403, "Forbidden");
    }

    const isRole = await prismaDB.user_roles.findUnique({where: {id: roleId}});

    if (!isRole) {
        return getErrorResponse(404, "Role not found");
    }

    const isPermission = await prismaDB.permissions.findUnique({where: {id: permissionId}});

    if (!isPermission) {
        return getErrorResponse(404, "Permission not found");
    }

    const role = await prismaDB.user_roles.findUnique({
        where: {
            id: roleId
        },
        include: {
            user_role_permissions: {
                include: {
                    permissions: true
                }
            }
        }
    });

    if (!role) {
        return getErrorResponse(404, "Role not found");
    }

    const hasRolePermission = role.user_role_permissions.find((rolePermission) => {
        return rolePermission.permissionsId === permissionId;
    });

    if (hasRolePermission) {
        return getErrorResponse(409, "Role already has permission");
    }

    await prismaDB.user_role_permissions.create({
        data: {
            user_rolesId: roleId,
            permissionsId: permissionId
        }
    });

    return getErrorResponse(200, "OK");

}

export async function DELETE(req: NextRequest, {params: {roleId, permissionId}}: {
    params: {
        roleId: string
        permissionId: string
    }
}) {
    const auth = await checkSessionAndPermissions(Permissions.user_roles_update);

    if (auth.error) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession)
            return getErrorResponse(401, "Unauthorized");
        if (auth.error === ISessionCheckAndPermissionsError.noPermission)
            return getErrorResponse(403, "Forbidden");
    }

    const isRole = await prismaDB.user_roles.findUnique({where: {id: roleId}});
    if (!isRole) {
        return getErrorResponse(404, "Role not found");
    }

    const isPermission = await prismaDB.permissions.findUnique({where: {id: permissionId}});
    if (!isPermission) {
        return getErrorResponse(404, "Permission not found");
    }

    const role = await prismaDB.user_roles.findUnique({
        where: {
            id: roleId
        },
        include: {
            user_role_permissions: {
                include: {
                    permissions: true
                }
            }
        }
    });

    if (!role) {
        return getErrorResponse(404, "Role not found");
    }

    const hasRolePermission = role.user_role_permissions.find((rolePermission) => {
        return rolePermission.permissionsId === permissionId;
    });

    if (!hasRolePermission) {
        return getErrorResponse(409, "Role does not have permission");
    }

    await prismaDB.user_role_permissions.delete({
        where: {
            id: hasRolePermission.id
        }
    });

    return getErrorResponse(200, "OK");

}
