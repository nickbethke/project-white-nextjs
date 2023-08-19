import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getResponse} from "@/lib/utils";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    return getResponse(200, !!session ? "Authenticated" : "Not Authenticated", session);
}
