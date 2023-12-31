import {ApiUser, ApiUserRole, DefaultUserRole} from "@/types/user";
import {dateTimeFormatted} from "@/lib/utils";
import md5 from "@/lib/md5";
import {ApiFile} from "@/types/file";

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
    file_create = "file_create",
    file_read = "file_read",
    file_update = "file_update",
    file_delete = "file_delete",
    project_create = "project_create",
    project_read = "project_read",
    project_update = "project_update",
    project_delete = "project_delete",
    task_create = "task_create",
    task_read = "task_read",
    task_update = "task_update",
    task_delete = "task_delete",
    issue_create = "issue_create",
    issue_read = "issue_read",
    issue_update = "issue_update",
    issue_delete = "issue_delete",
}

export const ReadablePermissions: Record<Permissions, string> = {
    own_profile_update: "Update own profile",
    own_profile_delete: "Delete own profile",
    user_create: "Create user",
    user_read: "Read user",
    user_update: "Update user",
    user_delete: "Delete user",
    user_role_create: "Create user role",
    user_role_read: "Read user role",
    user_role_update: "Update user role",
    user_role_delete: "Delete user role",
    user_role_permission_create: "Create user role permission",
    user_role_permission_read: "Read user role permission",
    user_role_permission_update: "Update user role permission",
    user_role_permission_delete: "Delete user role permission",
    notification_create: "Create notification",
    notification_read: "Read notification",
    notification_update: "Update notification",
    notification_delete: "Delete notification",
    option_create: "Create option",
    option_read: "Read option",
    option_update: "Update option",
    option_delete: "Delete option",
    calendar_event_create: "Create calendar event",
    calendar_event_read: "Read calendar event",
    calendar_event_update: "Update calendar event",
    calendar_event_delete: "Delete calendar event",
    group_create: "Create group",
    group_read: "Read group",
    group_update: "Update group",
    group_delete: "Delete group",
    group_member_create: "Create group member",
    group_member_read: "Read group member",
    group_member_update: "Update group member",
    group_member_delete: "Delete group member",
    user_roles_create: "Create user roles",
    user_roles_read: "Read user roles",
    user_roles_update: "Update user roles",
    user_roles_delete: "Delete user roles",
    file_create: "Create file",
    file_read: "Read file",
    file_update: "Update file",
    file_delete: "Delete file",
    project_create: "Create project",
    project_read: "Read project",
    project_update: "Update project",
    project_delete: "Delete project",
    task_create: "Create task",
    task_read: "Read task",
    task_update: "Update task",
    task_delete: "Delete task",
    issue_create: "Create issue",
    issue_read: "Read issue",
    issue_update: "Update issue",
    issue_delete: "Delete issue",
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
    profile_picture: string;


    constructor(apiUser: ApiUser) {
        this.createdAt = apiUser.createdAt;
        this.email = apiUser.email;
        this.firstname = apiUser.firstname;
        this.id = apiUser.id;
        this.lastname = apiUser.lastname;
        this.updatedAt = apiUser.updatedAt;
        this.user_role = apiUser.user_role;
        this.username = apiUser.username;
        this.profile_picture = apiUser.profile_picture;
    }

    get fullName(): string {
        return `${this.firstname} ${this.lastname}`;
    }

    get isAdmin() {
        return this.user_role.name === DefaultUserRole.admin || this.user_role.name === DefaultUserRole.superadmin;
    }

    get isSuperAdmin() {
        return this.user_role.name === DefaultUserRole.superadmin;
    }

    get isUser() {
        return this.user_role === undefined || this.user_role.name === DefaultUserRole.user;
    }

    get updated(): string {
        return dateTimeFormatted(this.updatedAt);
    }

    get created(): string {
        return dateTimeFormatted(this.createdAt);
    }

    get role(): string {
        return this.user_role.readable_name;
    }

    permission(permission: Permissions) {
        return this.user_role.user_role_permissions.find((userRolePermission) => {
            return userRolePermission.permissions.name === permission;
        }) !== undefined;
    }

    get profilePicture(): string {
        if (this.profile_picture === "gravatar") {
            const hash = md5(this.email);
            console.log(hash);
            return `https://www.gravatar.com/avatar/${hash}?s=200&d=mp`;
        }
        return this.profile_picture;
    }

    get profilePictureType(): "url" | "gravatar" {
        if (this.profile_picture === "gravatar") {
            return "gravatar";
        }
        return "url";
    }

    async changeProfilePicture(file: ApiFile) {
        return null;
    }
}

