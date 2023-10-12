import {ApiPermission, ApiUser, ApiUserRole} from "@/types/user";
import {ICalendarEvent} from "@/components/calendar/interfaces/calendar-overview-interfaces";
import {ApiGroupWithMembers} from "@/types/groups";
import {notifications} from ".prisma/client";
import {ApiFile} from "@/types/file";
import {ApiProject} from "@/types/projects";

export interface IResponse {
    status: "success" | "error" | "fail";
    message: string;
    data?: any;
    errors?: any;
}

export interface ISession extends IResponse {
    message: "Authorized" | "Unauthorized";
    data: {
        user: ApiUser | null
    }
}

export interface IUsersResponse extends IResponse {
    data: {
        users: ApiUser[]
    }
}

export interface IUserResponse extends IResponse {
    data: {
        user: ApiUser
    }
}


export interface ICalendarEvents extends IResponse {
    data: {
        events: ICalendarEvent[]
    }
}

export interface IGroupsResponse extends IResponse {
    data: {
        own: ApiGroupWithMembers[],
        all: ApiGroupWithMembers[]
    }
}

export interface IGroupsPostResponse extends IResponse {
    data: {
        group: ApiGroupWithMembers
    }
}

export type ApiNotification = notifications & {
    from: ApiUser,
}

export interface INotificationsResponse extends IResponse {
    data: {
        notifications: ApiNotification[]
    }
}

export interface INotificationResponse extends IResponse {
    data: {
        notification: ApiNotification
    }
}

export interface IUserRolesResponse extends IResponse {
    data: {
        userRoles: ApiUserRole[]
    }
}

export interface IUserRolesPermissionResponse extends IResponse {
    data: {
        permissions: ApiPermission[]
    }
}

export interface IUserRolesPermissionPatchResponse extends IResponse {
    data: {
        created: number,
        deleted: number,
    }
}

export interface IUserRoleResponse extends IResponse {
    data: {
        userRole: ApiUserRole
    }
}

export interface IFileUploadResponse extends IResponse {
    data: {
        file: ApiFile
    }
}

export interface IFilesResponse extends IResponse {
    data: {
        files: ApiFile[]
    }
}

export interface IFileResponse extends IResponse {
    data: {
        file: ApiFile
    }
}

export type FileInfo = {
    file_name: string, file_type: string, file_size_in_bytes: number
} & ({ file_dimensions: { width: number, height: number }, } | {})

export interface IFileInfoResponse extends IResponse {
    data: {
        fileInfo: FileInfo
    }
}

export interface IProjectsGet extends IResponse {
    data: {
        projects: ApiProject[]
    }
}

