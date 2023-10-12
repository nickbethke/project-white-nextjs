import { NotificationOverviewDashboard } from "@/components/dashboard/notification-overview";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: `Dashboard | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: "Dashboard description",
  };
}

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex gap-2 items-center">
        Project White <ChevronRight className="w-6 h-6 text-muted-foreground" />{" "}
        Dashboard
      </h1>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <NotificationOverviewDashboard />
      </div>
    </div>
  );
}
