import {ApiUser, ApiUserRole, UserRole} from "@/types/user";
import {dateTimeFormatted} from "@/lib/utils";

export enum Permissions {
    own_profile_update = "own_profile_update",
    own_profile_delete = "own_profile_delete",
    user_create = "user_create",
    user_read = "user_read",
    user_update = "user_update",
    user_delete = "user_delete",
    user_role_create = "user_role_create",
    user_role_read = "user_role_read",
    user_role_update = "user_role_update",
    user_role_delete = "user_role_delete",
    user_role_permission_create = "user_role_permission_create",
    user_role_permission_read = "user_role_permission_read",
    user_role_permission_update = "user_role_permission_update",
    user_role_permission_delete = "user_role_permission_delete",
    notification_create = "notification_create",
    notification_read = "notification_read",
    notification_update = "notification_update",
    notification_delete = "notification_delete",
    option_create = "option_create",
    option_read = "option_read",
    option_update = "option_update",
    option_delete = "option_delete",
    calendar_event_create = "calendar_event_create",
    calendar_event_read = "calendar_event_read",
    calendar_event_update = "calendar_event_update",
    calendar_event_delete = "calendar_event_delete",
    group_create = "group_create",
    group_read = "group_read",
    group_update = "group_update",
    group_delete = "group_delete",
    group_member_create = "group_member_create",
    group_member_read = "group_member_read",
    group_member_update = "group_member_update",
    group_member_delete = "group_member_delete",
    user_roles_create = "user_roles_create",
    user_roles_read = "user_roles_read",
    user_roles_update = "user_roles_update",
    user_roles_delete = "user_roles_delete",
}

interface IUser extends ApiUser {

}

export class User implements IUser {
    createdAt: Date;
    email: string;
    firstname: string;
    id: string;
    lastname: string;
    updatedAt: Date;
    user_role: ApiUserRole;
    username: string;


    constructor(apiUser: ApiUser) {
        this.createdAt = apiUser.createdAt;
        this.email = apiUser.email;
        this.firstname = apiUser.firstname;
        this.id = apiUser.id;
        this.lastname = apiUser.lastname;
        this.updatedAt = apiUser.updatedAt;
        this.user_role = apiUser.user_role;
        this.username = apiUser.username;
    }

    get fullName(): string {
        return `${this.firstname} ${this.lastname}`;
    }

    get isAdmin() {
        return this.user_role.name === UserRole.admin || this.user_role.name === UserRole.superadmin;
    }

    get isSuperAdmin() {
        return this.user_role.name === UserRole.superadmin;
    }

    get isUser() {
        return this.user_role === undefined || this.user_role.name === UserRole.user;
    }

    get updated(): string {
        return dateTimeFormatted(this.updatedAt);
    }

    get created(): string {
        return dateTimeFormatted(this.createdAt);
    }

    get role(): string {
        return this.user_role.readable;
    }

    permission(permission: Permissions) {
        return this.user_role.permissions[permission];
    }
}

