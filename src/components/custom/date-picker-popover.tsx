import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

type Props = {
  value: Date | undefined;
  onChange: (...event: any[]) => void;
  className?: string;
  label?: string;
};

export default function DatePickerPopover({
  value,
  onChange,
  className,
  label,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          type="button"
          className={cn(
            "w-full rounded-sm dark:bg-shark-900/60 bg-shark-50 pl-3 text-left font-normal justify-start items-center",
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? format(value, "PPP") : <span>{label ?? "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="pointer-events-auto w-auto p-0 z-[60]"
        align="start"
      >
        <div>
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={onChange}
            // disabled={date => date < new Date()}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
