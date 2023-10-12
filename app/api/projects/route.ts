import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {getProjectsByUserId} from "@/lib/db";

export async function GET() {

    const session_check = await checkSessionAndPermissions();

    if (session_check.error) {
        switch (session_check.error) {
            case ISessionCheckAndPermissionsError.noSession:
                return getErrorResponse(401, "Unauthorized");
            case ISessionCheckAndPermissionsError.noPermission:
                return getErrorResponse(403, "Forbidden");
        }
    }

    const projects = await getProjectsByUserId(session_check.user.id);

    return getResponse(200, "Success", {projects});
}
