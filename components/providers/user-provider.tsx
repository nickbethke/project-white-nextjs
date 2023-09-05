"use client";

import React from "react";
import {getUser} from "@/lib/auth-client";
import {User, Permissions} from "@/lib/user";

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

function useUserPermission(permission: Permissions | Permissions[]) {
    const user = useUser();
    if (Array.isArray(permission)) {
        let hasPermission = true;
        permission.forEach((p) => {
            if (!user.permission(p)) {
                hasPermission = false;
            }
        });
        return hasPermission ? user : null;
    } else {
        return user.permission(permission) ? user : null;
    }
}

export {UserProvider, useUser, UserContext};
