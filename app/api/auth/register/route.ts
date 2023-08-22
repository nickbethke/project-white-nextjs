import {getErrorResponse, getResponse} from "@/lib/utils";
import {NextRequest} from "next/server";
import {RegisterUserInput} from "@/lib/validations/user.schema";
import {prismaDB} from "@/lib/prisma";
import {hashPassword} from "@/lib/auth";
import {UserRole} from "@/types/user";
import ActivationMail from "@/emails/activation-mail";
import {Mail} from "@/lib/mail";
import {render} from "@react-email/render";

export async function POST(req: NextRequest) {
    const {email, password, passwordConfirm, firstName, lastName, username} = await req.json() as RegisterUserInput;
    if (password !== passwordConfirm) {
        return getErrorResponse(400, "Passwords do not match");
    }

    const usersWithEmailOrUsername = await prismaDB.users.findMany({
        where: {
            email,
            OR: [
                {
                    username
                }
            ]
        }
    });

    if (usersWithEmailOrUsername.length > 0) {
        return getErrorResponse(400, "User with this email or username already exists");
    }

    const activation_token = await hashPassword(email + Date.now());

    const user = await prismaDB.users.create({
        data: {
            email,
            password: await hashPassword(password),
            firstname: firstName,
            lastname: lastName,
            username,
            activation_token,
            user_role: {
                connect: {
                    name: UserRole.user
                }
            }
        }
    });
    await Mail.sendEmail({
        to: user.email,
        subject: "Project White - Activation",
        html: render(ActivationMail(user.activation_token, user.email)),
    });

    return getResponse(200, "OK", {
        ...user,
        password: undefined
    });
}
