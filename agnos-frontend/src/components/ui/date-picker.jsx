"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ value, onChange, readOnly = false, error }) {
  const [date, setDate] = React.useState(null);

  // Update date when value prop changes
  React.useEffect(() => {
    if (value) {
      try {
        // Try to parse as ISO string first
        let parsedDate = new Date(value);

        // If that fails, try to parse as dd/MM/yyyy format
        if (isNaN(parsedDate.getTime()) && value.includes("/")) {
          const parts = value.split("/");
          if (parts.length === 3) {
            parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }

        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        } else {
          setDate(null);
        }
      } catch {
        setDate(null);
      }
    } else {
      setDate(null);
    }
  }, [value]);

  const handleSelect = (selectedDate) => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setDate(selectedDate);
      if (onChange) {
        onChange({
          target: {
            name: "dob",
            value: selectedDate.toISOString(), // Use ISO format for better compatibility
          },
        });
      }
    } else {
      setDate(null);
      if (onChange) {
        onChange({
          target: {
            name: "dob",
            value: "",
          },
        });
      }
    }
  };

  return (
    <div className="space-y-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "w-full justify-start text-left font-normal h-10 focus:outline-none focus:ring-2",
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-teal-600 focus:ring-[#20746c4f]",
              !date && "text-muted-foreground",
              readOnly && "cursor-default opacity-80"
            )}
            disabled={readOnly}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date && !isNaN(date.getTime()) ? (
              format(date, "dd/MM/yyyy")
            ) : (
              <span>DD/MM/YYYY</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
