import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";
import {Permissions} from "@/lib/user";

export async function GET() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const notifications = await prismaDB.notifications.findMany({
        where: {
            to_id: session.user.id
        },
        include: {
            from: true
        }
    });

    return getResponse(200, "Notification GET", {notifications});
}

export async function POST(req: NextRequest) {
    const {subject, content, type, to_id, to_type} = await req.json();


    const auth = await checkSessionAndPermissions(Permissions.notification_create);

    if (auth.error !== null) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession)
            return getErrorResponse(401, "Unauthorized");

        else if (auth.error === ISessionCheckAndPermissionsError.noPermission)
            return getErrorResponse(403, "Forbidden");
    } else if (to_type === "group") {
        const group = await prismaDB.groups.findUnique({
            where: {
                id: to_id
            }, include: {
                group_members: true
            }
        });

        if (!group) {
            return getErrorResponse(404, "Group not found");
        }

        for (const member of group.group_members) {
            const notification = await prismaDB.notifications.create({
                data: {
                    subject,
                    content,
                    type,
                    to_id: member.user_id,
                    from_id: auth.user.id,
                }
            });

            if (!notification) {
                return getErrorResponse(500, "Error creating notification");
            }
        }

        return getResponse(200, "Notification POST", {});

    } else if (to_type === "user") {

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
                from_id: auth.user.id,
            }
        });

        if (!notification) {
            return getErrorResponse(500, "Error creating notification");
        }

        return getResponse(200, "Notification POST", notification);
    }
}

export async function DELETE(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }


    const notificationsIds = await req.json() as string[];

    await prismaDB.notifications.deleteMany({
        where: {
            to_id: session.user.id,
            id: {
                in: notificationsIds
            }
        }
    });
    return getResponse(200, "Notifications deleted", {});
}
