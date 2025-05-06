import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INITIAL_TASK, Task } from "./TaskModel";
import { toast } from "sonner";
import { getClients } from "@/services/clientService";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  client_id: z.string().min(1, "Client is required"),
  assignee: z.string().min(1, "Assignee is required"),
  status: z.enum(["Not Started", "In Progress", "Review", "Complete"]),
  deadline: z.string().min(1, "Deadline is required"),
  typeOfService: z.string().optional(),
  sacCode: z.string().optional(),
  description: z.string().optional(),
});

interface TaskFormProps {
  onSubmit: (data: Task) => void;
  clients: { id: string; name: string }[];
}

export function TaskForm({ onSubmit, clients: initialClients }: TaskFormProps) {
  const [clients, setClients] = useState(initialClients);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch clients if none provided
  useEffect(() => {
    const fetchClientsIfNeeded = async () => {
      if (initialClients.length === 0) {
        setIsLoading(true);
        try {
          const fetchedClients = await getClients();
          setClients(fetchedClients.map(client => ({
            id: client.id || '',
            name: client.name
          })));
        } catch (error) {
          console.error("Error fetching clients:", error);
          toast.error("Failed to load clients");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClientsIfNeeded();
  }, [initialClients]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      client_id: "",
      assignee: "",
      status: "Not Started",
      deadline: "",
      typeOfService: "",
      sacCode: "",
      description: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof taskSchema>) => {
    // Find the client name by ID
    const selectedClient = clients.find(c => c.id === data.client_id);
    
    const newTask: Task = {
      ...INITIAL_TASK,
      ...data,
      client: selectedClient?.name || '',
      id: crypto.randomUUID(),
      progress: data.status === "Complete" ? 100 : 0,
    };
    
    onSubmit(newTask);
    form.reset();
    toast({
      title: "Task created",
      description: "Your task has been created successfully",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter detailed description of the task"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Task</Button>
      </form>
    </Form>
  );
}
