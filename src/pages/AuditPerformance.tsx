
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuditChecklist } from "@/components/audit-performance/AuditChecklist";
import { type AuditChecklist as AuditChecklistType } from "@/components/audit-performance/AuditChecklistModel";
import { Task } from "@/components/tasks/TaskModel";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    typeOfService: "Statutory Audit",
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
    typeOfService: "Tax Audit",
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
  }
];

// Sample saved checklists for demonstration
const sampleSavedChecklists: AuditChecklistType[] = [
  {
    id: "checklist_1",
    taskId: "1",
    taskName: "Financial Statement Analysis",
    clientName: "ABC Corporation",
    type: "Statutory Audit",
    items: [],
    startDate: "2025-04-01",
    financialYear: "2024-25"
  }
];

const AuditPerformance = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [auditType, setAuditType] = useState<"Tax Audit" | "Statutory Audit">("Statutory Audit");
  const [savedChecklists, setSavedChecklists] = useState<AuditChecklistType[]>(sampleSavedChecklists);
  const [currentChecklist, setCurrentChecklist] = useState<AuditChecklistType | undefined>(undefined);
  
  // Filter tasks that can have audit checklists (Tax or Statutory Audit)
  const eligibleTasks = sampleTasks.filter(
    task => task.typeOfService === "Tax Audit" || task.typeOfService === "Statutory Audit"
  );
  
  // When a task is selected, set the selected task and check if there's a saved checklist
  useEffect(() => {
    if (!selectedTaskId) {
      setSelectedTask(null);
      setCurrentChecklist(undefined);
      return;
    }
    
    const task = sampleTasks.find(t => t.id === selectedTaskId);
    if (task) {
      setSelectedTask(task);
      
      // Determine audit type based on the task's service type
      if (task.typeOfService === "Tax Audit") {
        setAuditType("Tax Audit");
      } else {
        setAuditType("Statutory Audit");
      }
      
      // Check if there's a saved checklist for this task
      const existingChecklist = savedChecklists.find(c => c.taskId === selectedTaskId);
      setCurrentChecklist(existingChecklist);
    }
  }, [selectedTaskId, savedChecklists]);
  
  // Handle saving a checklist
  const handleSaveChecklist = (checklist: AuditChecklistType) => {
    setSavedChecklists(prev => {
      // Replace the existing checklist or add a new one
      const index = prev.findIndex(c => c.taskId === checklist.taskId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = checklist;
        return updated;
      } else {
        return [...prev, checklist];
      }
    });
    
    // Update the selected task's progress based on checklist completion
    const completedItems = checklist.items.filter(item => item.isDone).length;
    const progress = Math.round((completedItems / checklist.items.length) * 100);
    
    // In a real app, you would update the task in the database
    console.log(`Task ${checklist.taskId} progress updated to ${progress}%`);
    toast.success("Checklist saved and task progress updated");
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Audit Performance and Monitoring</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Audit Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Task</label>
                  <Select
                    value={selectedTaskId}
                    onValueChange={setSelectedTaskId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleTasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name} - {task.client} ({task.typeOfService})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Audit Type</label>
                  <Select
                    value={auditType}
                    onValueChange={(value: "Tax Audit" | "Statutory Audit") => setAuditType(value)}
                    disabled={!!selectedTask}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tax Audit">Tax Audit</SelectItem>
                      <SelectItem value="Statutory Audit">Statutory Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedTask ? (
                <AuditChecklist
                  taskId={selectedTask.id}
                  taskName={selectedTask.name}
                  clientName={selectedTask.client}
                  type={auditType}
                  onSave={handleSaveChecklist}
                  existingChecklist={currentChecklist}
                />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  Please select a task to view or create an audit checklist
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuditPerformance;
