import React from "react";

interface CommonRoute {
    label: string,
    active: boolean,
    hasSeparator?: boolean,
    canAccess?: boolean,
}


type RouteWithHref = CommonRoute & {
    icon: React.ReactNode,
    href: string,

}

type RouteWithChildren = CommonRoute & {
    icon: React.ReactNode,
    children: RouteWithHref[] | RouteWithChildren[]
}

export type SidebarRoute = RouteWithHref | RouteWithChildren;
