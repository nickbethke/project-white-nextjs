import {redirect} from "next/navigation";
import {getUserSsr} from "@/lib/ssr/user";
import {Profile} from "../components/profile-component";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";
import {Permissions} from "@/lib/user";

export default async function ProfileView({params}: { params: { profileId: string } }) {

    const auth = await checkSessionAndPermissions([Permissions.user_read]);

    if (!auth || auth.error) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession) {
            redirect('/auth/signin');
        }
        if (auth.error === ISessionCheckAndPermissionsError.noPermission) {
            redirect('/');
        }
    } else {
        const {session} = auth;

        if (session.user.id === params.profileId) {
            redirect('/profile');
        }
    }

    const viewedUser = await getUserSsr(params.profileId);

    if (!viewedUser) {
        redirect('/signin');
    }

    return <Profile user={viewedUser}/>;
}
