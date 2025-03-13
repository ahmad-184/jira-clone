"use client";

import { Control } from "react-hook-form";

import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePickerPopover from "./date-picker-popover";

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
            <DatePickerPopover value={field.value} onChange={field.onChange} />
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
