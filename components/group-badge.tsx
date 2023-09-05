import React from "react";
import {ApiGroupWithMembers} from "@/types/groups";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            size: {
                md: "flex items-center justify-center w-6 h-6 rounded-full bg-accent-foreground text-md",
                lg: "flex items-center justify-center w-8 h-8 rounded-full bg-accent-foreground text-xl",
                xl: "flex items-center justify-center w-10 h-10 rounded-full bg-accent-foreground text-2xl",
            },

        },
        defaultVariants: {
            size: "md",
        },
    }
)

export type BadgeSize = VariantProps<typeof badgeVariants>["size"]

export function GroupBadge({group, size}: { group: ApiGroupWithMembers, size?: BadgeSize }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={cn(badgeVariants({size}))}>
                <span className="text-accent font-bold">{group.name[0]}</span>
            </div>
            <div className="flex flex-col text-left">
                <span className="font-bold">{group.name}</span>
                <span
                    className="text-xs text-muted-foreground">{group.group_members.length} member(s)</span>
            </div>
        </div>
    )
}
