import {
  GetTasksWithSearchQueriesUseCaseReturn,
  GetTaskUseCaseReturn,
} from "@/use-cases/types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import EventCard from "./event-card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import DatePickerPopover from "@/components/custom/date-picker-popover";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Props = {
  tasks: GetTasksWithSearchQueriesUseCaseReturn["tasks"] | undefined;
};
type OnNavigate = (action: "prev" | "next" | "today") => void;
type Event = {
  id: GetTaskUseCaseReturn["id"];
  title: GetTaskUseCaseReturn["name"];
  start: Date;
  end: Date;
  allDay: boolean;
  project: GetTaskUseCaseReturn["project"];
  assignee: GetTaskUseCaseReturn["assignedTo"];
  status: GetTaskUseCaseReturn["status"];
  description: GetTaskUseCaseReturn["description"];
};

export default function TaskCalendar({ tasks = [] }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  const onNavigate: OnNavigate = action => {
    if (action === "prev") {
      setSelectedDate(subMonths(selectedDate, 1));
    }
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    }
    if (action === "today") {
      setSelectedDate(new Date());
    }
  };

  useEffect(() => {
    const filteredTasks = tasks.map(task => ({
      id: task.id,
      title: task.name,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      project: task.project,
      assignee: task.assignedTo,
      status: task.status,
      description: task.description ?? "",
    }));
    setEvents(filteredTasks);
  }, [tasks]);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="">
        <Calendar
          localizer={localizer}
          date={selectedDate}
          events={events}
          views={["month"]}
          defaultView="month"
          toolbar={true}
          showAllEvents={true}
          popup={true}
          selectable={true}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
          formats={{
            weekdayFormat: (date, culture, localizer) =>
              localizer?.format(date, "EEE", culture) ?? "",
          }}
          components={{
            eventWrapper: ({ event }) => {
              return (
                <EventCard
                  id={event.id}
                  title={event.title}
                  project={event.project}
                  assignee={event.assignee}
                  status={event.status}
                />
              );
            },
            toolbar: () => {
              return (
                <div className="flex justify-end w-full mb-3">
                  <div>
                    <div className="flex items-center gap-4">
                      <div>
                        <Button
                          onClick={() => onNavigate("prev")}
                          variant="outline"
                          size="icon"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <DatePickerPopover
                          className="!bg-shark-950"
                          value={selectedDate}
                          onChange={setSelectedDate}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={() => onNavigate("next")}
                          variant="outline"
                          size="icon"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
