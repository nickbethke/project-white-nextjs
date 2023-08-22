import React from "react";
import {SidebarRoute} from "@/types/ui-types";
import {cn} from "@/lib/utils";
import {uniqueId} from "lodash";
import {ChevronUp} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {User} from "@/lib/user";

export const SidebarItem: React.FC<{
    route: SidebarRoute,
    isChild?: boolean,
    user: User
}> = ({
          route,
          isChild = false,
          user
      }) => {
    const itemClasses = cn("flex items-center gap-4 px-4 py-2 cursor-pointer transition", route.active ? "bg-muted text-accent-foreground" : "", isChild && route.active ? "hover:bg-muted-foreground/75" : "hover:bg-muted/50", isChild ? "text-sm" : "text-base");

    const [open, setOpen] = React.useState<boolean>(route.active);
    const [routeState, setRouteState] = React.useState<SidebarRoute>(route);

    React.useEffect(() => {
        setRouteState(route);
    }, [route]);


    if (routeState.canAccess !== undefined && !routeState.canAccess) {
        return null;
    }


    if ("children" in routeState) {
        return (
            <div key={uniqueId()}>
                <div className={itemClasses} onClick={() => setOpen(!open)}>
                    <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                        {routeState.icon}
                    </div>
                    <p className="tracking-tighter">{routeState.label}</p>
                    <ChevronUp
                        className={cn("ml-auto w-4 h-4 text-muted-foreground transition-transform duration-500", open ? "" : "rotate-180")}/>
                </div>
                <div
                    className={cn("flex flex-col gap-2 pl-8 transition-maxHeight bg-muted", open ? "max-h-[100%]" : "max-h-0 overflow-hidden")}>
                    {routeState.children.map((child) => (
                        <SidebarItem key={uniqueId()} route={child} isChild={true} user={user}/>
                    ))}
                </div>
                {routeState.hasSeparator && <Separator className="my-1"/>}
            </div>
        );
    }

    const activeClass = isChild ? "bg-muted-foreground text-muted" : "bg-muted text-accent-foreground"
    const iconActiveClasses = isChild && routeState.active ? "text-muted" : "";

    return (
        <div key={routeState.href}>
            <Link href={routeState.href}
                  className={cn(itemClasses, routeState.active ? activeClass : "")}>
                <div
                    className={cn("text-muted-foreground w-4 h-4 flex items-center justify-center", iconActiveClasses)}>
                    {routeState.icon}
                </div>
                <p className="tracking-tighter">{routeState.label}</p>
            </Link>
            {routeState.hasSeparator && <Separator className="my-1"/>}
        </div>
    );
}
