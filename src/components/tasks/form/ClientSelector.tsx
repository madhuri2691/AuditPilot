
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "./taskSchema";

interface ClientSelectorProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
  clients: { id: string; name: string }[];
  isLoading: boolean;
}

export const ClientSelector = ({ form, clients, isLoading }: ClientSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="client_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Client</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading clients..." : "Select client"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {clients.length === 0 ? (
                <SelectItem value="no-clients" disabled>No clients available</SelectItem>
              ) : (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
