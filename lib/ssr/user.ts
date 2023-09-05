import {User} from "@/lib/user";
import {prismaDB} from "@/lib/prisma";

export async function getUserSsr(id: string) {
    const dbUser = await prismaDB.users.findUnique({
        where: {
            id: id
        },
        include: {
            user_role: {
                include: {
                    permissions: true
                }
            }
        }
    });

    if (!dbUser) {
        return null;
    }

    return new User(dbUser);
}
