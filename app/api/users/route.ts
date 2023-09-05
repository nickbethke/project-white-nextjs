import {NextRequest} from "next/server";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {prismaDB} from "@/lib/prisma";
import {authOptions, hashPassword} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {ApiUser} from "@/types/user";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";
import {Permissions} from "@/lib/user";
import {NewUserInput} from "@/lib/validations/new-user.schema";
import {Mail} from "@/lib/mail";
import {render} from "@react-email/render";
import ActivationMail from "@/emails/activation-mail";

enum UserSearchType {
    user = "user",
    role = "role",
    permission_can = "permission:can",
    permission_cannot = "permission:cannot"
}

class UserSearchQuery {
    searchQuery: string;
    readonly type: UserSearchType;

    constructor(searchQuery: string) {
        this.searchQuery = searchQuery;
        this.type = this.determineSearchType(searchQuery);
        this.searchQuery = this.searchQuery.replace(`${this.type}:`, "");
    }

    private determineSearchType(searchQuery: string): UserSearchType {
        if (searchQuery.startsWith("permission:cannot")) {
            return UserSearchType.permission_cannot;
        }
        if (searchQuery.startsWith("permission:can")) {
            return UserSearchType.permission_can;
        }
        if (searchQuery.startsWith("role:")) {
            return UserSearchType.role;
        }
        return UserSearchType.user;

    }

}

class UserSearch {
    query: UserSearchQuery;
    results: Promise<ApiUser[]>;

    constructor(query: string) {
        this.query = new UserSearchQuery(query);

        this.results = Promise.resolve([]);

        if (this.query.type === UserSearchType.role) {
            this.results = this.searchRole();
        }

        if (this.query.type === UserSearchType.user) {
            this.results = this.searchUser();
        }

        if (this.query.type === UserSearchType.permission_can) {
            this.results = this.searchPermission(true);
        }

        if (this.query.type === UserSearchType.permission_cannot) {
            this.results = this.searchPermission(false);
        }
    }

    async searchRole() {
        const role = this.query.searchQuery;
        const user_role_id = await prismaDB.user_roles.findUnique({
            where: {
                name: role
            },
            select: {
                id: true
            }
        });

        if (!user_role_id) {
            return [];
        }

        const users = await prismaDB.users.findMany({
            where: {
                user_role_id: user_role_id?.id
            },
            include: {
                user_role: {
                    include: {
                        permissions: true
                    }
                }
            }
        });

        return users ?? [];
    }

    private searchUser() {
        return prismaDB.users.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: this.query.searchQuery
                        }
                    },
                    {
                        firstname: {
                            contains: this.query.searchQuery
                        }
                    },
                    {
                        lastname: {
                            contains: this.query.searchQuery
                        }
                    },
                    {
                        email: {
                            contains: this.query.searchQuery
                        }
                    }
                ]
            },
            include: {
                user_role: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
    }

    private searchPermission(can: boolean) {

        const permission = this.query.searchQuery;
        const allowedPermissions = [
            "own_profile_update",
            "own_profile_delete",
            "user_create",
            "user_read",
            "user_update",
            "user_delete",
            "user_role_create",
            "user_role_read",
            "user_role_update",
            "user_role_delete",
            "user_role_permission_create",
            "user_role_permission_read",
            "user_role_permission_update",
            "user_role_permission_delete",
            "notification_create",
            "notification_read",
            "notification_update",
            "notification_delete",
            "option_create",
            "option_read",
            "option_update",
            "option_delete",
            "calendar_event_create",
            "calendar_event_read",
            "calendar_event_update",
            "calendar_event_delete",
            "group_create",
            "group_read",
            "group_update",
            "group_delete",
            "group_member_create",
            "group_member_read",
            "group_member_update",
            "group_member_delete",
        ];

        if (!allowedPermissions.includes(permission)) {
            return Promise.resolve([]);
        }

        return prismaDB.users.findMany({
            where: {
                user_role: {
                    permissions: {
                        some: {
                            [permission]: can
                        }
                    }
                }
            },
            include: {
                user_role: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
    }
}

export async function GET(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return getErrorResponse(401, "Unauthorized");
    }

    const searchQuery = req.nextUrl.searchParams.get("searchQuery");

    if (searchQuery) {
        const search = new UserSearch(searchQuery);
        const results = await search.results;
        return getResponse(200, "User GET", {users: results});
    }

    const users = await prismaDB.users.findMany({
            select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                email: true,
                user_role: true,
                createdAt: true,
                updatedAt: true,
            }
        }
    );
    return getResponse(200, "User GET", {users});
}

export async function POST(req: NextRequest) {
    const auth = await checkSessionAndPermissions(Permissions.user_create);

    if (auth.error) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession)
            return getErrorResponse(401, "Unauthorized");
        if (auth.error === ISessionCheckAndPermissionsError.noPermission)
            return getErrorResponse(403, "Forbidden");
    }

    const data = (await req.json()).data as NewUserInput;

    console.log(data);

    const {username, firstName, lastName, email, password, passwordConfirm, withActivation, role} = data;

    if (password !== passwordConfirm) {
        return getErrorResponse(400, "Passwords do not match");
    }

    if (!username)
        return getErrorResponse(400, "Username is required");

    const activation_token = await hashPassword(email + Date.now());

    const user = await prismaDB.users.create({
        data: {
            username: username,
            firstname: firstName,
            lastname: lastName,
            email,
            password: await hashPassword(password),
            user_role: {
                connect: {
                    id: role
                }
            },
            activation_token: withActivation ? activation_token : "",
        }
    });

    if (withActivation) {
        await Mail.sendEmail({
            to: user.email,
            subject: "Project White - Activation",
            html: render(ActivationMail(user.activation_token, user.email)),
        });
    }

    return getResponse(200, "User POST", {user});
}
