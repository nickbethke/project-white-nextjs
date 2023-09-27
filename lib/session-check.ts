import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getUserSsr} from "@/lib/ssr/user";
import {Permissions, User} from "@/lib/user";
import {ApiUser} from "@/types/user";

export enum ISessionCheckAndPermissionsError {
    noSession = "noSession",
    noPermission = "noPermission",
}

export interface ISessionCheckAndPermissionsOnError {
    error: ISessionCheckAndPermissionsError;
}

export interface ISessionCheckAndPermissionsOnSuccess {
    error: null;
    user: User;
    session: Session;
    apiUser: ApiUser;
}

export type ISessionCheckAndPermissionsResult =
    ISessionCheckAndPermissionsOnError
    | ISessionCheckAndPermissionsOnSuccess;

export async function checkSessionAndPermissions(permission?: Permissions | Permissions[]): Promise<ISessionCheckAndPermissionsResult> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return {error: ISessionCheckAndPermissionsError.noSession};
    }

    const user = await getUserSsr(session.user.id);

    if (!user) {
        return {error: ISessionCheckAndPermissionsError.noSession};
    }

    if (!permission) {
        return {error: null, user, session, apiUser: JSON.parse(JSON.stringify(user)) as ApiUser};
    }
    if (Array.isArray(permission)) {
        for (const p of permission) {
            if (!user.permission(p)) {
                return {error: ISessionCheckAndPermissionsError.noPermission};
            }
        }
    } else if (!user.permission(permission)) {
        return {error: ISessionCheckAndPermissionsError.noPermission};

    } else {
        return {error: null, user, session, apiUser: JSON.parse(JSON.stringify(user)) as ApiUser};
    }

    return {error: null, user, session, apiUser: JSON.parse(JSON.stringify(user)) as ApiUser};
}
