import {NextRequest} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {notification_status} from "@prisma/client";
import {prismaDB} from "@/lib/prisma";

export async function POST(req: NextRequest, {params}: { params: { status: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const status = params.status as notification_status;
    if (!Object.values(notification_status).includes(status)) {
        return getErrorResponse(404, "Status not found");
    }

    const notificationsIds = await req.json() as string[];

    const notifications = await prismaDB.notifications.updateMany({
        where: {
            to_id: session.user.id,
            id: {
                in: notificationsIds
            }
        },
        data: {
            status
        }
    });

    if (notifications.count === 0) {
        return getErrorResponse(404, "Notification not found");
    }
    return getResponse(200, "Notifications updated", notifications);
}
