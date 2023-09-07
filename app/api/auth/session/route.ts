import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return getResponse(401, "Unauthorized", null);


    const user = await prismaDB.users.findUnique({
        where: {
            id: session.user.id
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

    if (!user) return getResponse(401, "Unauthorized", null);

    return getResponse(200, "Authorized", {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            user_role: user.user_role,
            firstname: user.firstname,
            lastname: user.lastname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    });
}
