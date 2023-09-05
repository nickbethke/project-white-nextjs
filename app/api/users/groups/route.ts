import {getErrorResponse, getResponse} from "@/lib/utils";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prismaDB} from "@/lib/prisma";
import {NextRequest} from "next/server";
import {getUserSsr} from "@/lib/ssr/user";
import {Permissions} from "@/lib/user";

const AuthTypes: Record<string, Permissions> = {
    create: Permissions.group_create,
    read: Permissions.group_read,
    update: Permissions.group_update,
    delete: Permissions.group_delete,
    member_create: Permissions.group_member_create,
    member_read: Permissions.group_member_read,
    member_update: Permissions.group_member_update,
    member_delete: Permissions.group_member_delete,
}

type AuthType = keyof typeof AuthTypes;

async function checkAuth(authType: AuthType | AuthType[] | false, checkAdmin = true) {
    const session = await getServerSession(authOptions);

    if (!session) return null

    const user = await getUserSsr(session.user.id);

    if (!user) return null
    if (checkAdmin && authType !== false) {
        if (typeof authType === "string") {
            if (!user.permission(AuthTypes[authType])) return null
        }

        if (Array.isArray(authType)) {
            for (const type of authType) {
                if (!user.permission(AuthTypes[type])) return null
            }
        }
    }
    return session

}

export async function GET() {
    const session = await checkAuth(false);

    if (!session) return getErrorResponse(401, "Unauthorized");


    const own_groups = await prismaDB.groups.findMany({
        where: {
            group_members: {
                some: {
                    user_id: session.user.id
                }
            }
        },
        include: {
            group_members: {
                select: {
                    user_id: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstname: true,
                            lastname: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true,
                            user_role: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    });

    const all_groups = await prismaDB.groups.findMany({
        include: {
            group_members: {
                select: {
                    user_id: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstname: true,
                            lastname: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true,
                            user_role: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    });

    return getResponse(200, "ok", {own: own_groups, all: all_groups});
}

export async function POST(req: NextRequest) {
    const session = await checkAuth([Permissions.group_create, Permissions.group_member_create]);

    if (!session) return getErrorResponse(401, "Unauthorized");

    const {name, addMyself} = await req.json();

    const groupWithName = await prismaDB.groups.findUnique({
        where: {
            name: name,
        }
    });

    if (groupWithName) return getErrorResponse(400, "Group with this name already exists");

    if (addMyself) {
        const group = await prismaDB.groups.create({
            data: {
                name: name,
                group_members: {
                    create: {
                        user_id: session.user.id,
                    }
                }
            },
        });
        return getResponse(200, "Created group and added yourself", group);
    }
    const group = await prismaDB.groups.create({
        data: {
            name: name,
        },
    });
    return getResponse(200, "Created group", group);
}

export async function DELETE(req: NextRequest) {
    const session = await checkAuth(Permissions.group_delete);
    if (!session) return getErrorResponse(401, "Unauthorized");

    const {group_id} = await req.json();

    const group = await prismaDB.groups.delete({
        where: {
            id: group_id
        }
    });

    return getResponse(200, "ok", group);
}
