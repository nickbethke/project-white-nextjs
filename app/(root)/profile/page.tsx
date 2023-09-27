import {redirect} from "next/navigation";
import {Profile} from "./components/profile-component";
import {checkSessionAndPermissions, ISessionCheckAndPermissionsError} from "@/lib/session-check";
import {ApiUser} from "@/types/user";

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
        const {apiUser} = auth;
        return <Profile user={apiUser}/>;
    }

}

export default ProfilePage;
