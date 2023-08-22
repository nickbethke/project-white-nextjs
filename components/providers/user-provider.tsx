"use client";

import React from "react";
import {ApiUser} from "@/types/user";
import {getUser} from "@/lib/auth-client";
import {User} from "@/lib/user";


const UserContext = React.createContext<User | null>(null);
type UserProviderProps = {
    children: React.ReactNode;
}

function UserProvider({children, ...props}: UserProviderProps) {

    const [user, setUser] = React.useState<User | null>(null);


    React.useEffect(() => {
        (async () => {
            const user = await getUser();
            if (user) {
                setUser(new User(user));
            }
        })();
    }, []);

    if (!user) {
        return null;
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export {UserProvider, useUser, UserContext};
