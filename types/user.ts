import {Prisma} from ".prisma/client";

export type User = {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    user_role: UserRole;
    activation_token: string;
}

export enum UserRole {
    user = "User",
    admin = "Admin",
    superadmin = "SuperAdmin"
}

export type ApiUserRole = {
    id: string;
    name: string;
    readable: string;
    createdAt: Date;
    updatedAt: Date;
    permissions: ApiPermission[];
}

export interface ApiPermission extends Prisma.user_role_permissionsUncheckedCreateWithoutUser_roleInput {
    id: string;
}

export type ApiUser = {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    user_role: ApiUserRole;
}
