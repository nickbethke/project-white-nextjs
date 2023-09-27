"use client";

import {usePathname} from "next/navigation";
import React from "react";
import {
    Boxes,
    Calendar,
    Cog, Files,
    Group,
    Home,
    Inbox,
    ListTodo,
    MessageCircleIcon,
    Settings,
    User,
    Users
} from "lucide-react";
import {uniqueId} from "lodash";
import {SidebarRoute} from "@/types/ui-types";
import {SidebarItem} from "@/components/sidebar-item";
import {useUser} from "@/components/providers/user-provider";
import {Permissions} from "@/lib/user";
import {cn} from "@/lib/utils";

function Sidebar({...props}: React.HTMLAttributes<HTMLDivElement>) {
    const pathname = usePathname();
    const user = useUser();

    const routes: SidebarRoute[] = [{
        href: `/`,
        label: "Dashboard",
        active: pathname === `/`,
        icon: <Home/>,
        hasSeparator: true,
    }, {
        href: `/inbox`,
        label: "Inbox",
        active: pathname === `/inbox` || pathname.startsWith(`/inbox/`),
        icon: <MessageCircleIcon/>,
        hasSeparator: true,
        canAccess: user.permission(Permissions.notification_read),
    }, {
        href: `/projects`,
        label: "Projects",
        active: pathname === `/projects`,
        icon: <Boxes/>,
    }, {
        href: `/tasks`,
        label: "Tasks",
        active: pathname === `/tasks`,
        hasSeparator: true,
        icon: <ListTodo/>
    }, {
        href: `/calendar`,
        label: "Calendar",
        active: pathname === `/calendar`,
        hasSeparator: true,
        icon: <Calendar/>
    }, {
        href: `/files`,
        label: "Files",
        active: pathname === `/files`,
        icon: <Files/>,
        hasSeparator: true,
        canAccess: user.permission(Permissions.file_read),
    }, {
        href: `/profile`,
        label: "Profile",
        active: pathname === `/profile`,
        icon: <User/>,
    }, {
        href: `/users`,
        label: "Users",
        active: pathname === `/users`,
        icon: <Users/>,
        hasSeparator: true
    }, {
        label: "Settings",
        active: pathname === `/settings` || pathname.startsWith(`/settings/`),
        icon: <Settings/>,
        children: [{
            href: `/settings`,
            label: "General",
            active: pathname === `/settings`,
            icon: <Cog/>,
            hasSeparator: true,
        }, {
            href: `/settings/groups`,
            label: "Groups",
            active: pathname === `/settings/groups` || pathname.startsWith(`/settings/groups/`),
            icon: <Group/>,
            canAccess: user.permission(Permissions.group_read),

        }, {
            href: `/settings/user-roles`,
            label: "User Roles",
            active: pathname === `/settings/user-roles`,
            icon: <Users/>,
            canAccess: user.permission(Permissions.user_role_read),
            hasSeparator: true,
        }, {
            href: `/settings/emails`,
            label: "Emails",
            active: pathname === `/settings/emails`,
            icon: <Inbox/>,
        }]
    }];

    return (
        <aside className={cn('flex flex-grow flex-col min-h-screen select-none', props.className)} {...props}>
            <div className="flex-grow overflow-y-auto border-r flex flex-col py-4">
                {user && routes.map((route) => (
                    <SidebarItem key={uniqueId()} route={route} user={user}/>
                ))}
            </div>
        </aside>
    );
}

export {Sidebar};
