import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prismaDB} from "@/lib/prisma";

export async function GET() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized")
    }

    const events = await prismaDB.calendar_events.findMany({
        where: {
            user_id: session.user.id
        }
    });

    return getResponse(200, "OK", {events});
}

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized")
    }

    const {title, notes, start, end, links} = await req.json();

    const event = await prismaDB.calendar_events.create({
        data: {
            title,
            notes,
            start,
            end,
            links,
            user_id: session.user.id
        }
    });

    return getResponse(200, "OK", {event});
}
