import {prismaDB} from "@/lib/prisma";
import {Permissions} from "@/lib/user";

export async function getPermissionIdByName(name: Permissions) {
    return prismaDB.permissions.findFirst({
        where: {
            name: name
        }
    });
}
