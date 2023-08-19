import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {notification_status} from "@prisma/client";

export async function GET() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const notifications = await prismaDB.notifications.findMany({
        where: {
            to_id: session.user.id
        }
    });

    return getResponse(200, "Notification GET", {notifications});
}

export async function POST(req: NextRequest) {
    const {subject, content, type, to_id} = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const user = await prismaDB.users.findUnique({
        where: {
            id: to_id
        }
    });

    if (!user) {
        return getErrorResponse(404, "User not found");
    }

    const notification = await prismaDB.notifications.create({
        data: {
            subject,
            content,
            type,
            to_id: to_id,
            from_id: session.user.id,
            status: "unread"
        }
    });

    if (!notification) {
        return getErrorResponse(500, "Error creating notification");
    }

    return getResponse(200, "Notification POST", notification);
}

export async function DELETE(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }


    const notificationsIds = await req.json() as string[];

    const notifications = await prismaDB.notifications.deleteMany({
        where: {
            to_id: session.user.id,
            id: {
                in: notificationsIds
            }
        }
    });

    if (notifications.count === 0) {
        return getErrorResponse(404, "Notification not found");
    }
    return getResponse(200, "Notifications deleted", notifications);
}
