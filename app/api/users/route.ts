import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function GET(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const users = await prismaDB.users.findMany({
            select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                email: true,
                user_role: true,
                createdAt: true,
                updatedAt: true,
            }
        }
    );
    return getResponse(200, "User GET", {users});
}
