import {ChevronRight} from "lucide-react";
import React from "react";
import {Metadata} from "next";

export function generateMetadata(): Metadata {
    return {
        title: `Settings ▫️ Emails | ${process.env.NEXT_PUBLIC_APP_NAME}`,
        description: "Group description"
    };
}

function EmailsSettingsPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> Emails
            </h1>
        </div>
    );
}

export default EmailsSettingsPage;
