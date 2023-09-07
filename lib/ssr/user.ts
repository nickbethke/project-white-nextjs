import {User} from "@/lib/user";
import {prismaDB} from "@/lib/prisma";
import {ApiUser} from "@/types/user";

export async function getUserSsr(id: string) {
    const user = await prismaDB.users.findUnique({
        where: {
            id
        },
        include: {
            user_role: {
                include: {
                    user_role_permissions: {
                        include: {
                            permissions: true
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        return null;
    }

    return new User(user as ApiUser);
}
