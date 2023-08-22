import {NextAuthOptions} from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            username: string
            email: string
        }
    }

    interface User {
        id: string
        username: string
        email: string
    }

    function useSession(): [Session, boolean]

    function getServerSession(options: NextAuthOptions): Promise<Session>

}
