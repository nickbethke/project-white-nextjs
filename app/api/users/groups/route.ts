import {getErrorResponse, getResponse} from "@/lib/utils";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prismaDB} from "@/lib/prisma";
import {user_role} from ".prisma/client";
import {NextRequest} from "next/server";

async function checkAuth(checkAdmin = true) {
    const session = await getServerSession(authOptions);

    if (!session) return false

    const user = await prismaDB.users.findUnique({
        where: {
            id: session.user.id
        }
    });

    if (!user) return false

    if (checkAdmin && user.user_role !== user_role.admin && user.user_role !== user_role.superadmin) return false

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
    const session = await checkAuth();

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
    const session = await checkAuth();
    if (!session) return getErrorResponse(401, "Unauthorized");

    const {group_id} = await req.json();

    const group = await prismaDB.groups.delete({
        where: {
            id: group_id
        }
    });

    return getResponse(200, "ok", group);
}
