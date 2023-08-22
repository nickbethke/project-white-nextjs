import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

type DashboardItemProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;

}

export function DashboardItem({title, description, icon, children}: DashboardItemProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex gap-2 items-center">
                        {icon}
                        <span className="text-lg font-bold">{title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
