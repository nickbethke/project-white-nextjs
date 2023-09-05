import {getErrorResponse, getResponse} from "@/lib/utils";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getUserSsr} from "@/lib/ssr/user";
import {Permissions} from "@/lib/user";
import {prismaDB} from "@/lib/prisma";
import {NextRequest} from "next/server";

export async function GET() {
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

    const userRoles = await prismaDB.user_roles.findMany({include: {permissions: true}});

    return getResponse(200, "OK", {userRoles});
}
