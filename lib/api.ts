import {
    IGroupsResponse, INotificationResponse, INotificationsResponse,
    IUserResponse,
    IUserRoleResponse,
    IUserRolesResponse,
    IUsersResponse
} from "@/types/axios-responses";
import axios, {AxiosError} from "axios";
import {ApiUser, ApiUserRole} from "@/types/user";
import {ApiGroupWithMembers} from "@/types/groups";

export class ApiResponseType<T> {
    data: T;
    error: boolean;
    errorMessage: string;

    constructor(data: T, error = false, errorMessage = "") {
        this.data = data;
        this.error = error;
        this.errorMessage = errorMessage;
    }

    get isSuccess() {
        return !this.error;
    }

    get isError() {
        return this.error;
    }

    static success<T>(data: T) {
        return new ApiResponseType<T>(data);
    }

    static error(errorMessage: string) {
        return new ApiResponseType<null>(null, true, errorMessage);
    }
}

export default class Api {
    static async getUsers() {
        try {
            const response = await axios.get<IUsersResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users`);
            return ApiResponseType.success<ApiUser[]>(response.data.data.users);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    default:
                        return ApiResponseType.error("Error fetching users");
                }
            }
            return ApiResponseType.error("Error fetching users");
        }
    }

    static async getUser(id: string) {
        try {
            const response = await axios.get<IUserResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
            return ApiResponseType.success<ApiUser>(response.data.data.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    case 404:
                        return ApiResponseType.error("User not found");
                    default:
                        return ApiResponseType.error("Error fetching user");
                }
            }
            return ApiResponseType.error("Error fetching user");
        }
    }

    static async getGroups() {
        try {
            const response = await axios.get<IGroupsResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/groups`);
            return ApiResponseType.success<ApiGroupWithMembers[]>(response.data.data.all);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    default:
                        return ApiResponseType.error("Error fetching groups");
                }
            }
        }
    }

    static async getRoles() {
        try {
            const response = await axios.get<IUserRolesResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`);
            return ApiResponseType.success<ApiUserRole[]>(response.data.data.userRoles);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    default:
                        return ApiResponseType.error("Error fetching roles");
                }
            }
        }
    }

    static async getRole(id: string) {
        try {
            const response = await axios.get<IUserRoleResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${id}`);
            return ApiResponseType.success<ApiUserRole>(response.data.data.userRole);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    case 404:
                        return ApiResponseType.error("Role not found");
                    default:
                        return ApiResponseType.error("Error fetching role");
                }
            }
            return ApiResponseType.error("Error fetching role");
        }
    }

    static async getNotifications() {
        try {
            const response = await axios.get<INotificationsResponse>(`${process.env.NEXT_PUBLIC_API_URL}/notifications`);
            return ApiResponseType.success(response.data.data.notifications);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    default:
                        return ApiResponseType.error("Error fetching notifications");
                }
            }
        }
    }

    static async deleteNotifications(ids: string[]) {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {data: {ids}});
            return ApiResponseType.success({});
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    default:
                        return ApiResponseType.error("Error deleting notifications");
                }
            }
        }
    }

    static async deleteNotification(id: string) {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`);
            return ApiResponseType.success({});
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    case 404:
                        return ApiResponseType.error("Notification not found");
                    default:
                        return ApiResponseType.error("Error deleting notification");
                }
            }
        }

    }

    static async getNotification(id: string) {
        try {
            const response = await axios.get<INotificationResponse>(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`);
            return ApiResponseType.success(response.data.data.notification);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 401:
                        return ApiResponseType.error("Unauthorized");
                    case 403:
                        return ApiResponseType.error("Forbidden");
                    case 404:
                        return ApiResponseType.error("Notification not found");
                    default:
                        return ApiResponseType.error("Error fetching notification");
                }
            }
        }

    }
}
