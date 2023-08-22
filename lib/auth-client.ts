import axios from "axios";
import {ISession} from "@/types/axios-responses";
import {ApiUser} from "@/types/user";

export async function getUser(): Promise<ApiUser | null> {
    try {
        const session = await axios.get<ISession>(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`);
        return session.data.data.user;
    } catch (e) {
        if (e instanceof Error)
            console.log(e);
        return null;
    }
}
