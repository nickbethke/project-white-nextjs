import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {Prisma} from ".prisma/client";
import {Permissions, ReadablePermissions} from "@/lib/user";
import {hashPassword} from "@/lib/auth";
import {DefaultUserRole} from "@/types/user";

export async function GET() {

    const permissions: Prisma.permissionsCreateWithoutUser_role_permissionsInput[] = Object.keys(Permissions).map((key) => {
        return {
            name: key,
            readable_name: ReadablePermissions[key as Permissions],
        }
    });

    for (const permissionsKey in permissions) {
        const existingPermission = await prismaDB.permissions.findFirst({
            where: {
                name: permissions[permissionsKey].name
            }
        });

        if (!existingPermission) {
            await prismaDB.permissions.create({
                data: permissions[permissionsKey]
            });
        }
    }

    const dbPermissions = await prismaDB.permissions.findMany();

    const superAdminRoleExists = await prismaDB.user_roles.findFirst({
        where: {
            name: DefaultUserRole.superadmin
        }
    });

    if (superAdminRoleExists) {
        return getErrorResponse(500, "Super admin role already exists");
    }
    const superAdminRole = await prismaDB.user_roles.create({
        data: {
            name: DefaultUserRole.superadmin,
            readable_name: "Super Admin",
        }
    });

    for (const permissionKey in dbPermissions) {
        await prismaDB.user_role_permissions.create({
            data: {
                user_rolesId: superAdminRole.id,
                permissionsId: dbPermissions[permissionKey].id
            }
        });
    }

    const superAdminUser = await prismaDB.users.create({
        data: {
            email: "superadmin@project-white.de",
            username: "superadmin",
            firstname: "Super",
            lastname: "Admin",
            password: await hashPassword("superadmin"),
            user_role: {
                connect: {
                    id: superAdminRole.id
                }
            },
            activation_token: "",
        }
    });

    const adminRoleExists = await prismaDB.user_roles.findFirst({
        where: {
            name: DefaultUserRole.admin
        }
    });

    if (adminRoleExists) {
        return getErrorResponse(500, "Admin role already exists");
    }

    const adminRole = await prismaDB.user_roles.create({
        data: {
            name: DefaultUserRole.admin,
            readable_name: "Admin",
        }
    });

    const userRoleExists = await prismaDB.user_roles.findFirst({
        where: {
            name: DefaultUserRole.user
        }
    });

    if (userRoleExists) {
        return getErrorResponse(500, "User role already exists");
    }

    const userRole = await prismaDB.user_roles.create({
        data: {
            name: DefaultUserRole.user,
            readable_name: "User",
        }
    });

    const developerRoleExists = await prismaDB.user_roles.findFirst({
        where: {
            name: DefaultUserRole.developer
        }
    });

    if (developerRoleExists) {
        return getErrorResponse(500, "Developer role already exists");
    }

    const developerRole = await prismaDB.user_roles.create({
        data: {
            name: DefaultUserRole.developer,
            readable_name: "Developer",
        }
    });

    return getResponse(200, "OK", {});

}
