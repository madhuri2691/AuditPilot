
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowRight, Check, Edit } from "lucide-react";
import { Task } from "./TaskModel";
import { InvoiceGenerator } from "./InvoiceGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface TasksListProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: string, progress: number) => void;
  showInvoice: boolean;
}

const getProgressByStatus = (status: string): number => {
  switch (status) {
    case "Not Started": return 0;
    case "In Progress": return 50;
    case "Review": return 90;
    case "Complete": return 100;
    default: return 0;
  }
};

export function TasksList({ tasks, onUpdateStatus, showInvoice }: TasksListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const progress = getProgressByStatus(newStatus);
    onUpdateStatus(taskId, newStatus, progress);
  };

  if (tasks.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No tasks found</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Type of Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{task.client}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.typeOfService || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    task.status === "Not Started"
                      ? "outline"
                      : task.status === "In Progress"
                      ? "secondary"
                      : task.status === "Review"
                      ? "default"
                      : "secondary"
                  }
                >
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Progress value={task.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{task.progress}%</span>
                </div>
              </TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {showInvoice ? (
                    <>
                      <InvoiceGenerator task={task} />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onUpdateStatus(task.id, "In Progress", 50)}
                      >
                        <ArrowUp size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            <Edit size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Task Status</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-medium mb-2">{selectedTask?.name}</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">
                                  Current Status: <Badge>{selectedTask?.status}</Badge>
                                </label>
                                <Select 
                                  onValueChange={(value) => {
                                    if (selectedTask) {
                                      handleStatusChange(selectedTask.id, value);
                                    }
                                  }}
                                  defaultValue={selectedTask?.status}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select new status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Not Started">Not Started</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Complete">Complete</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {task.status !== "Complete" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(task.id, "Complete")}
                        >
                          <Check size={16} />
                        </Button>
                      )}
                    </>
                  )}
                  <Button variant="ghost" size="icon">
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
