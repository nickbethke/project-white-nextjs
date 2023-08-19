import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const {email, token} = await req.json();

    if (!email || !token) {
        return getErrorResponse(400, "Missing email or token");
    }

    const user = await prismaDB.users.findFirst({
        where: {
            email,
        }
    });

    if (!user) {
        return getErrorResponse(400, "User not found");
    }

    if (user.activation_token !== token) {
        return getErrorResponse(400, "Invalid token");
    }

    await prismaDB.users.update({
        where: {
            id: user.id,
        },
        data: {
            activation_token: "",
        }
    });

    return getResponse(200, "OK", {
        message: "User activated"
    })
}
