import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prismaDB} from "@/lib/prisma";
import ReactMarkdown from "react-markdown";

const RenderEventNotes = async ({params}: { params: { eventId: string } }) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return null;
    }

    const event = await prismaDB.calendar_events.findUnique({
        where: {
            id: params.eventId,
            user_id: session.user.id
        }
    });

    if (!event) {
        return null;
    }

    return (
        <ReactMarkdown className="markdown-body p-4">
            {event.notes}
        </ReactMarkdown>
    );
}

export default RenderEventNotes;
