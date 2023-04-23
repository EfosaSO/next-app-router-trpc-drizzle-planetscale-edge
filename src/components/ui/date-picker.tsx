"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn, formatDate } from "~/lib/utils";

interface Props {
  value: string;
  onChange: SelectSingleEventHandler;
}

const CalendarDatePicker = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const date = React.useMemo(
      () => (props.value ? new Date(props.value) : new Date()),
      [props.value]
    );
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !props.value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {props.value ? formatDate(props.value) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" ref={ref}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={props.onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

CalendarDatePicker.displayName = "CalendarDatePicker";

export { CalendarDatePicker };
