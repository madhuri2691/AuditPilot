import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TasksList } from "@/components/tasks/TasksList";
import { useState } from "react";
import { Task } from "@/components/tasks/TaskModel";

const Index = () => {
  // Add state for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Add a function to handle task status updates (placeholder)
  const handleUpdateTaskStatus = (taskId: string, status: string, progress: number) => {
    // In a real app, this would update the task status
    console.log("Update task status", taskId, status, progress);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-audit-primary">Dashboard</h1>

        {/* Recent Tasks Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tasks</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <TasksList 
              tasks={tasks} 
              onUpdateStatus={handleUpdateTaskStatus}
              showInvoice={false}
            />
          </CardContent>
        </Card>

        {/* Keep existing code for other dashboard elements */}
      </div>
    </MainLayout>
  );
};

export default Index;
