import {prismaDB} from "@/lib/prisma";
import {Permissions} from "@/lib/user";

export async function getPermissionIdByName(name: Permissions) {
    return (await prismaDB.permissions.findFirst({
        where: {
            name: name
        }
    }))?.id ?? null;
}

export async function getProjectsByUserId(userId: string) {
    // return where the user is a member or the project is public
    return prismaDB.projects.findMany({
        where: {
            OR: [
                {
                    members: {
                        some: {
                            id: userId
                        }
                    }
                },
                {
                    is_public: true
                }
            ]
        }
    });
}
