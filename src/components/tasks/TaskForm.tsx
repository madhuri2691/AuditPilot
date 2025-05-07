
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { INITIAL_TASK, Task } from "./TaskModel";
import { toast } from "sonner";
import { getClients } from "@/services/clientService";
import { BasicTaskInfo } from "./form/BasicTaskInfo";
import { ClientSelector } from "./form/ClientSelector";
import { AssigneeInput } from "./form/AssigneeInput";
import { StatusSelector } from "./form/StatusSelector";
import { DeadlineInput } from "./form/DeadlineInput";
import { ServiceDetails } from "./form/ServiceDetails";
import { taskSchema } from "./form/taskSchema";
import { z } from "zod";

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
          console.log("Fetched clients:", fetchedClients);
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
    toast.success("Task created successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <BasicTaskInfo form={form} />
            <ClientSelector form={form} clients={clients} isLoading={isLoading} />
            <AssigneeInput form={form} />
          </div>
          
          <div className="space-y-4">
            <StatusSelector form={form} />
            <DeadlineInput form={form} />
            <ServiceDetails form={form} />
          </div>
        </div>

        <Button type="submit" className="mt-6">Create Task</Button>
      </form>
    </Form>
  );
}
