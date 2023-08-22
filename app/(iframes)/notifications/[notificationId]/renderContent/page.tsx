import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prismaDB} from "@/lib/prisma";
import ReactMarkdown from "react-markdown";

const RenderNotification = async ({params}: { params: { notificationId: string } }) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return null;
    }

    const notification = await prismaDB.notifications.findUnique({
        where: {
            id: params.notificationId,
            to_id: session.user.id
        }
    });

    if (!notification) {
        return null;
    }

    return (
        <ReactMarkdown className="markdown-body p-4">
            {notification.content}
        </ReactMarkdown>
    );
}

export default RenderNotification;
