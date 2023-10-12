"use client";

import { Separator } from "@/components/ui/separator";
import CalenderOverview from "@/components/calendar/calendar-overview";
import React from "react";

export default function CalendarPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex gap-2 items-baseline">Calendar</h1>
      <Separator />
        {/* TODO: Overwork with a modal not every button its own */}
        {/*<CalenderOverview className="mt-4" />*/}
    </div>
  );
}
