import {NextRequest, NextResponse} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {Mail} from "@/lib/mail";
import {render} from "@react-email/render";
import ActivationMail from "@/emails/activation-mail";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(301, "Unauthorized");
    }

    const user = await prismaDB.users.findFirst({
        where: {
            id: session.user.id
        }
    });

    if (!user) {
        return getErrorResponse(301, "Unauthorized");
    }

    if (user.activation_token === "") {
        return getErrorResponse(400, "User already activated");
    }

    await Mail.sendEmail({
        to: user.email,
        subject: "Project White - Activation",
        html: render(ActivationMail(user.activation_token, user.email)),
    });

    return getResponse(200, "OK", {
        message: "Activation email sent"
    });
}
