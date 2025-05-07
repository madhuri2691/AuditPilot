
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "./taskSchema";

interface ServiceDetailsProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
}

export const ServiceDetails = ({ form }: ServiceDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="typeOfService"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Service</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Audit, Tax Filing" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sacCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SAC Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter SAC code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
