
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "./taskSchema";

interface DeadlineInputProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
}

export const DeadlineInput = ({ form }: DeadlineInputProps) => {
  return (
    <FormField
      control={form.control}
      name="deadline"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Deadline</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
