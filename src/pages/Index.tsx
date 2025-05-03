import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TasksList } from "@/components/tasks/TasksList";
import { useState, useEffect } from "react";
import { Task } from "@/components/tasks/TaskModel";
import { Link } from "react-router-dom";
import { ArrowRight, CheckSquare, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample tasks data for demonstration
const sampleTasks: Task[] = [
  {
    id: "1",
    name: "Financial Statement Analysis",
    client: "ABC Corporation",
    assignee: "Jane Doe",
    status: "In Progress",
    progress: 60,
    deadline: "2025-06-15",
    typeOfService: "Audit",
    description: "Annual financial statement audit"
  },
  {
    id: "2",
    name: "Tax Compliance Review",
    client: "XYZ Industries",
    assignee: "John Smith",
    status: "Not Started",
    progress: 0,
    deadline: "2025-05-30",
    typeOfService: "Tax",
    description: "Quarterly tax compliance check"
  },
  {
    id: "3",
    name: "Internal Control Assessment",
    client: "Global Services Inc",
    assignee: "Robert Johnson",
    status: "Review",
    progress: 90,
    deadline: "2025-05-10",
    typeOfService: "Internal Audit",
    description: "Assessment of internal controls"
  },
  {
    id: "4",
    name: "Annual GST Audit",
    client: "Tech Solutions",
    assignee: "Jane Doe",
    status: "Complete",
    progress: 100,
    deadline: "2025-04-15",
    typeOfService: "Statutory Audit",
    description: "Completed but invoice not generated"
  },
  {
    id: "5",
    name: "Quarterly Financial Review",
    client: "Acme Ltd",
    assignee: "Robert Johnson",
    status: "Complete",
    progress: 100,
    deadline: "2025-04-05",
    typeOfService: "Audit",
    description: "Invoice already generated"
  }
];

const Index = () => {
  // State for different task categories
  const [incompleteTasks, setIncompleteTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [unbilledTasks, setUnbilledTasks] = useState<Task[]>([]);
  
  // Initialize task data on component mount
  useEffect(() => {
    // Filter tasks by status
    const incomplete = sampleTasks.filter(task => 
      task.status === "Not Started" || task.status === "In Progress" || task.status === "Review"
    );
    
    const completed = sampleTasks.filter(task => task.status === "Complete");
    
    // For demonstration purposes, we'll consider some completed tasks as unbilled
    // In a real app, this would come from a proper invoicing system
    const unbilled = completed.filter((_, index) => index === 0); // Just the first completed task
    
    setIncompleteTasks(incomplete);
    setCompletedTasks(completed);
    setUnbilledTasks(unbilled);
  }, []);
  
  // Function to handle task status updates
  const handleUpdateTaskStatus = (taskId: string, status: string, progress: number) => {
    // In a real app, this would update the task status in the backend
    console.log("Update task status", taskId, status, progress);
    
    // Update the UI by moving tasks between categories as needed
    if (status === "Complete") {
      const taskToMove = incompleteTasks.find(task => task.id === taskId);
      if (taskToMove) {
        const updatedTask = { ...taskToMove, status: "Complete" as Task["status"], progress: 100 };
        setIncompleteTasks(incompleteTasks.filter(task => task.id !== taskId));
        setCompletedTasks([...completedTasks, updatedTask]);
        setUnbilledTasks([...unbilledTasks, updatedTask]); // Also add to unbilled
      }
    } else {
      setIncompleteTasks(incompleteTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: status as Task["status"], progress };
        }
        return task;
      }));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-audit-primary">Dashboard</h1>

        {/* Tasks Overview Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tasks Overview</CardTitle>
            <Link to="/tasks">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="incomplete" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="incomplete" className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  Incomplete Tasks ({incompleteTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckSquare size={16} />
                  Completed & Unbilled ({unbilledTasks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="incomplete">
                <TasksList 
                  tasks={incompleteTasks} 
                  onUpdateStatus={handleUpdateTaskStatus}
                  showInvoice={false}
                />
              </TabsContent>
              
              <TabsContent value="completed">
                <TasksList 
                  tasks={unbilledTasks} 
                  onUpdateStatus={handleUpdateTaskStatus}
                  showInvoice={true}
                />
                {unbilledTasks.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No completed tasks awaiting invoicing
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Keep existing code for other dashboard elements */}
      </div>
    </MainLayout>
  );
};

export default Index;
