
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "./taskSchema";

interface AssigneeInputProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
}

export const AssigneeInput = ({ form }: AssigneeInputProps) => {
  return (
    <FormField
      control={form.control}
      name="assignee"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assignee</FormLabel>
          <FormControl>
            <Input placeholder="Enter assignee name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
