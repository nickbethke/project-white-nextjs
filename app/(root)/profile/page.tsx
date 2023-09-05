import {redirect} from "next/navigation";
import {Profile} from "./components/profile-component";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";

const ProfilePage = async () => {

    const auth = await checkSessionAndPermissions();

    if (!auth || auth.error) {
        if (auth.error === ISessionCheckAndPermissionsError.noSession) {
            redirect('/auth/signin');
        }
        if (auth.error === ISessionCheckAndPermissionsError.noPermission) {
            redirect('/');
        }
        return null;
    } else {
        const {user} = auth;
        return <Profile user={user}/>;
    }

}

export default ProfilePage;
