import {ApiUser} from "@/types/user";
import {ICalendarEvent} from "@/components/calendar/interfaces/calendar-overview-interfaces";

export interface IResponse {
    status: "success" | "error" | "fail";
    message: string;
    data?: any;
    errors?: any;
}

export interface ISession extends IResponse {
    data: {
        user: {
            id: string,
            username: string,
            email: string,
        }
    }
}

/*
{
  "status": "fail",
  "message": "User not found",
  "errors": null
}
 */
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
