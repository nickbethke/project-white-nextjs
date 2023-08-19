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
    user = "user",
    admin = "admin",
    superadmin = "superadmin"
}

export type ApiUser = {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
