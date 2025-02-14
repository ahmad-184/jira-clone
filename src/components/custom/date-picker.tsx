"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
};

export function DatePicker({ control, label, name, description }: Props) {
  return (
    <div className="w-full">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col flex-1">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    type="button"
                    className={cn(
                      "w-full rounded-sm dark:!bg-shark-900/60 bg-shark-50 pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 !opacity-50 hover:!opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="pointer-events-auto w-auto p-0 z-[60]"
                align="start"
              >
                <div>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < new Date()}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
            {!!description?.length && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
