"use client";

import {usePathname} from "next/navigation";
import React from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Boxes, Calendar, Home, Inbox, ListTodo, Settings, User} from "lucide-react";
import {Separator} from "@/components/ui/separator";

type Route = {
    href: string,
    label: string,
    active: boolean,
    icon?: React.ReactNode,
    hasSeparator?: boolean
}

export function Sidebar({className, ...props}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const routes: Route[] = [{
        href: `/`,
        label: "Dashboard",
        active: pathname === `/`,
        icon: <Home/>,
        hasSeparator: true
    }, {
        href: `/inbox`,
        label: "Inbox",
        active: pathname === `/inbox` || pathname === `/inbox/status/archived` || pathname === `/inbox/type/request` || pathname === `/inbox/type/alert`,
        icon: <Inbox/>,
        hasSeparator: true
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
        href: `/profile`,
        label: "Profile",
        active: pathname === `/profile`,
        icon: <User/>,
        hasSeparator: true
    }, {
        href: `/settings`,
        label: "Settings",
        active: pathname === `/settings`,
        icon: <Settings/>
    }];

    const itemClasses = cn("flex items-center gap-4 px-4 py-2 hover:bg-accent cursor-pointer transition", className);

    return (
        <div className="flex flex-grow flex-col min-h-screen">
            <div className="flex-grow overflow-y-auto border-r flex flex-col py-4">
                {routes.map((route) => (
                    <div key={route.href}>
                        <Link href={route.href}
                              className={cn(itemClasses, route.active ? "bg-muted text-accent-foreground" : "")}>
                            <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                                {route.icon}
                            </div>
                            <p className="tracking-tighter">{route.label}</p>
                        </Link>
                        {route.hasSeparator && <Separator/>}
                    </div>
                ))}
            </div>
        </div>
    );
}
