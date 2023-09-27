import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function GET(req: NextRequest, {params: {userId}}: { params: { userId: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const user = await prismaDB.users.findUnique({
        select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            user_role: true,
            createdAt: true,
            updatedAt: true,
            profile_picture: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        return getErrorResponse(404, "User not found");
    }

    return getResponse(200, "User GET", {user});
}
