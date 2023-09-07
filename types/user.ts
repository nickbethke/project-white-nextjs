export enum DefaultUserRole {
    user = "User",
    admin = "Admin",
    superadmin = "SuperAdmin",
    developer = "Developer"
}

export type ApiUserRole = {
    id: string;
    name: string;
    readable_name: string;
    createdAt: Date;
    updatedAt: Date;
    user_role_permissions: ApiUserRolePermission[];
}

export interface ApiUserRolePermission {
    id: string;
    user_rolesId: string
    permissionsId: string
    permissions: ApiPermission;
}

export type ApiPermission = {
    id: string;
    name: string;
    readable_name: string;
    createdAt: Date;
    updatedAt: Date;
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
