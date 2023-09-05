import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {NextRequest} from "next/server";
import {notification_status} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function GET(req: NextRequest, {params}: { params: { notificationId: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const status = params.notificationId as notification_status;

    // if status in notification_status
    if (!Object.values(notification_status).includes(status)) {
        return getErrorResponse(404, "Status not found");
    }

    const notification = await prismaDB.notifications.findUnique({
        where: {
            id: params.notificationId
        }
    });

    return getResponse(200, "Notifications with status", {notification});
}

export async function DELETE(req: NextRequest, {params}: { params: { notificationId: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const notificationId = params.notificationId;

    const notification = await prismaDB.notifications.delete({
        where: {
            to_id: session.user.id,
            id: notificationId
        }
    });

    if (!notification) {
        return getErrorResponse(404, "Notification not found");
    }

    return getResponse(200, "Notifications with status deleted", {notification});
}

export async function PATCH(req: NextRequest, {params}: { params: { notificationId: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const notificationId = params.notificationId;

    const {status} = await req.json();

    const notification = await prismaDB.notifications.update({
        where: {
            to_id: session.user.id,
            id: notificationId
        },
        data: {
            status
        }
    });

    if (!notification) {
        return getErrorResponse(404, "Notification not found");
    }

    return getResponse(200, "Notifications with status updated", {notification});
}
