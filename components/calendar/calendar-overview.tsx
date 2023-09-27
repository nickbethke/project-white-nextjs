"use client";

import * as React from "react";
import {
  ICalendarEvent,
  ICalendarOverviewProps,
  ICalendarOverviewState,
} from "@/components/calendar/interfaces/calendar-overview-interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { ICalendarEvents } from "@/types/axios-responses";
import { NewCalendarEventDialog } from "@/components/dialogs/new-calendar-event-dialog";
import { useCalendarEventModalStore } from "@/lib/hooks/use-calendar-event-modal";

const CalenderOverview: React.FC<ICalendarOverviewProps> = ({ className }) => {
  const calendarEventModal = useCalendarEventModalStore();
  const [state, setState] = React.useState<ICalendarOverviewState>({
    shownYear: new Date().getFullYear(),
    events: [],
  });

  const [dialogOpen, setDialogOpen] = React.useState<{
    open: boolean;
    date: Date;
  }>({
    open: false,
    date: new Date(),
  });
  const [dialogMounted, setDialogMounted] = React.useState<boolean>(false);

  const [year, setYear] = React.useState<number>(new Date().getFullYear());

  const currentDay = new Date().getDate(),
    currentMonth = new Date().getMonth(),
    currentYear = new Date().getFullYear();

  const firstDayInWeek = 1; // Monday

  React.useEffect(() => {
    axios.get<ICalendarEvents>("/api/calendar/events").then((res) => {
      setState({
        ...state,
        events: res.data.data.events,
      });
    });
  }, []);

  React.useEffect(() => {
    setState({
      ...state,
      shownYear: year,
    });
  }, [state, year]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay() - firstDayInWeek;
  };

  const getMonthName = (month: number) => {
    return new Date(2021, month, 1).toLocaleString("en-us", { month: "long" });
  };

  const dateHasEvent = (date: Date) => {
    return state.events.some((event: ICalendarEvent) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const onDateClick = (date: Date) => {
    if (dateHasEvent(date)) {
      console.log("Event found");
      calendarEventModal.open(true);
      calendarEventModal.setCalenderEntry(
        state.events.find((event: ICalendarEvent) => {
          const eventDate = new Date(event.start);
          return (
            eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
          );
        })
      );
      return;
    }
    setDialogOpen({ open: true, date });
  };

  const getMonthDays = (month: number, year: number) => {
    const days = [];
    const firstDay = getFirstDayOfMonth(month, year);
    const daysInMonth = getDaysInMonth(month, year);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div className="w-1/7 h-8"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      if (i === currentDay && month === currentMonth && year === currentYear) {
        days.push(
          <Button
            size="sm"
            className="w-1/7"
            variant={
              dateHasEvent(new Date(year, month, i))
                ? "calendar-entry-current"
                : "default"
            }
            onClick={() => onDateClick(new Date(year, month, i))}
          >
            {i}
          </Button>
        );
        continue;
      }
      days.push(
        <Button
          size="sm"
          variant={
            dateHasEvent(new Date(year, month, i))
              ? "calendar-entry"
              : "outline"
          }
          className="w-1/7"
          onClick={() => onDateClick(new Date(year, month, i))}
        >
          {i}
        </Button>
      );
    }

    return days;
  };

  const getCalendar = () => {
    if (!dialogMounted) return <p>Waiting for dialog to mount</p>;

    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(
        <div className="w-full h-full">
          <Card>
            <CardHeader>
              <CardTitle>{getMonthName(i)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full grid grid-cols-7 gap-2 text-center text-sm font-semibold text-accent-foreground">
                <div className="w-1/7">M</div>
                <div className="w-1/7">T</div>
                <div className="w-1/7">W</div>
                <div className="w-1/7">T</div>
                <div className="w-1/7">F</div>
                <div className="w-1/7">S</div>
                <div className="w-1/7">S</div>
              </div>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {getMonthDays(i, state.shownYear)}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return months;
  };

  return (
    <div {...{ className }}>
      <div className="flex gap-2 items-center">
        <Button
          onClick={() => setYear(year - 1)}
          variant="outline"
          size="sm"
          title="Previous year"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={() => setYear(year + 1)}
          variant="outline"
          size="sm"
          title="Next year"
        >
          <ChevronRight />
        </Button>
        <Input
          type="number"
          value={year}
          className="w-24"
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
        <NewCalendarEventDialog
          onOpenChange={(open) => setDialogOpen({ ...dialogOpen, open })}
          open={dialogOpen.open}
          startDate={dialogOpen.date}
          onMount={() => setDialogMounted(true)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {getCalendar()}
      </div>
    </div>
  );
};

export default CalenderOverview;
