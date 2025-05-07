
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { taskSchema } from "./taskSchema";

interface DeadlineInputProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
}

export const DeadlineInput = ({ form }: DeadlineInputProps) => {
  // State to store the selected date
  const [date, setDate] = useState<Date | undefined>(undefined);

  // When component mounts, if there's a value in the form, convert it to Date
  useEffect(() => {
    const currentValue = form.getValues("deadline");
    if (currentValue) {
      try {
        const parsedDate = new Date(currentValue);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (e) {
        console.error("Failed to parse date:", currentValue);
      }
    }
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="deadline"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Period Ended</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  if (selectedDate) {
                    // Format the date as ISO string (YYYY-MM-DD)
                    field.onChange(format(selectedDate, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
