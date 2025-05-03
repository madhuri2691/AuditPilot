
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  client: z.string().min(1, "Client is required"),
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

export function TaskForm({ onSubmit, clients }: TaskFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      client: "",
      assignee: "",
      status: "Not Started",
      deadline: "",
      typeOfService: "",
      sacCode: "",
      description: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof taskSchema>) => {
    const newTask: Task = {
      ...INITIAL_TASK,
      ...data,
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
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
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
