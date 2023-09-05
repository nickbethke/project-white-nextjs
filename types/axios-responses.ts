import {ApiUser, ApiUserRole} from "@/types/user";
import {ICalendarEvent} from "@/components/calendar/interfaces/calendar-overview-interfaces";
import {ApiGroupWithMembers} from "@/types/groups";
import {notifications} from ".prisma/client";

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

export interface IUserRoleResponse extends IResponse {
    data: {
        userRole: ApiUserRole
    }
}
