
import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  client_id: z.string().min(1, "Client is required"),
  assignee: z.string().min(1, "Assignee is required"),
  status: z.enum(["Not Started", "In Progress", "Review", "Complete"]),
  deadline: z.string().min(1, "Period ended date is required"), // Updated label reflection in error message
  typeOfService: z.string().optional(),
  sacCode: z.string().optional(),
  description: z.string().optional(),
});
