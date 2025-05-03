
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
import { ArrowRight } from "lucide-react";

export interface Task {
  id: string;
  name: string;
  client: string;
  assignee: string;
  status: "Not Started" | "In Progress" | "Review" | "Complete";
  progress: number;
  deadline: string;
}

const tasks: Task[] = [
  {
    id: "1",
    name: "Preliminary Risk Assessment",
    client: "ABC Corporation",
    assignee: "John Smith",
    status: "In Progress",
    progress: 65,
    deadline: "2025-05-20"
  },
  {
    id: "2",
    name: "Walkthrough of Controls",
    client: "XYZ Industries",
    assignee: "Jane Doe",
    status: "Not Started",
    progress: 0,
    deadline: "2025-05-25"
  },
  {
    id: "3",
    name: "Substantive Testing",
    client: "Acme Ltd",
    assignee: "Robert Johnson",
    status: "Review",
    progress: 90,
    deadline: "2025-05-15"
  },
  {
    id: "4",
    name: "Management Letter",
    client: "Global Services Inc",
    assignee: "Sarah Williams",
    status: "Complete",
    progress: 100,
    deadline: "2025-05-05"
  },
  {
    id: "5",
    name: "Financial Statement Review",
    client: "Tech Solutions",
    assignee: "Mike Brown",
    status: "In Progress",
    progress: 40,
    deadline: "2025-05-30"
  }
];

export function TasksList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.name}</TableCell>
            <TableCell>{task.client}</TableCell>
            <TableCell>{task.assignee}</TableCell>
            <TableCell>
              <Badge
                variant={
                  task.status === "Not Started"
                    ? "outline"
                    : task.status === "In Progress"
                    ? "secondary"
                    : task.status === "Review"
                    ? "default"
                    : "success"
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
            <TableCell>
              <Button variant="ghost" size="icon">
                <ArrowRight size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
