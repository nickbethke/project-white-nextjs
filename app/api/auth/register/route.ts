import {getErrorResponse, getResponse} from "@/lib/utils";
import {NextRequest} from "next/server";
import {RegisterUserInput} from "@/lib/validations/user.schema";
import {prismaDB} from "@/lib/prisma";
import {hashPassword} from "@/lib/auth";
import {UserRole} from "@/types/user";

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

    const user = await prismaDB.users.create({
        data: {
            email,
            password: await hashPassword(password),
            firstname: firstName,
            lastname: lastName,
            username,
            activation_token: await hashPassword(email + Date.now()),
            user_role: UserRole.user
        }
    });
    return getResponse(200, "OK", {
        ...user,
        password: undefined
    });
}
