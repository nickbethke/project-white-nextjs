import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { useCalendarEventModalStore } from "@/lib/hooks/use-calendar-event-modal";
import { uniqueId } from "lodash";
import moment from "moment";
import Link from "next/link";
import React from "react";

const CalendarEventModal: React.FC = () => {
  const calenderEntryModal = useCalendarEventModalStore();
  if (!calenderEntryModal.calenderEntry) return null;
  const links = JSON.parse(calenderEntryModal.calenderEntry.links);
  return (
    <Modal
      isOpen={calenderEntryModal.isOpen}
      onClose={() => calenderEntryModal.open(false)}
      title={calenderEntryModal.calenderEntry.title}
      description="Calendar Event"
    >
      <div className="flex flex-col space-y-4 min-h-max">
        <div className="flex space-x-4">
          <p>Start:</p>
          <p>
            {moment(calenderEntryModal.calenderEntry.start).format(
              "DD.MM.YYYY HH:mm"
            )}
          </p>
        </div>
        <div className="flex space-x-4">
          <p>End:</p>
          <p>
            {moment(calenderEntryModal.calenderEntry.end).format(
              "DD.MM.YYYY HH:mm"
            )}
          </p>
        </div>
        <Separator />
        <div className="flex space-x-4">
          <p>Notes:</p>
          <iframe
            className="w-full h-96"
            title="Calendar Event Notes"
            src={`/calendar/events/${calenderEntryModal.calenderEntry.id}/renderContent`}
          />
        </div>
        <Separator />
        <div className="flex space-x-4">
          <p>Links:</p>
          <div className="flex flex-col space-y-2">
            {links.map((link: string, index: number) => (
              <Link
                key={uniqueId()}
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarEventModal;
