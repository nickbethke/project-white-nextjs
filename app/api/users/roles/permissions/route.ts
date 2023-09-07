import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const permissions = await prismaDB.permissions.findMany();

    return getResponse(200, "OK", {permissions});

}
