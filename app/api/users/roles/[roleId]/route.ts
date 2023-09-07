import {NextRequest} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {getUserSsr} from "@/lib/ssr/user";
import {Permissions} from "@/lib/user";
import {prismaDB} from "@/lib/prisma";

export async function GET(req: NextRequest, {params: {roleId}}: {
    params: {
        roleId: string
    }
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const user = await getUserSsr(session.user.id);

    if (!user) {
        return getErrorResponse(404, "User not found");
    }

    if (!user.permission(Permissions.user_role_read)) {
        return getErrorResponse(403, "Forbidden");
    }

    const userRole = await prismaDB.user_roles.findMany({
        include: {
            user_role_permissions: {
                include: {
                    permissions: true
                }
            }
        }, where: {id: roleId}
    });

    return getResponse(200, "OK", {userRole});
}
