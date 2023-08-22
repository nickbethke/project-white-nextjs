import {Separator} from "@/components/ui/separator";
import React from "react";
import {Metadata} from "next";

export function generateMetadata(): Metadata {
    return {
        title: `Settings | ${process.env.NEXT_PUBLIC_APP_NAME}`,
        description: "Group description"
    };
}

export default async function SettingsPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-baseline">
                Settings
            </h1>
            <Separator/>
        </div>
    )
}
