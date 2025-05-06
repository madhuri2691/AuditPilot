
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuditChecklist } from "@/components/audit-performance/AuditChecklist";
import { taxAuditChecklistItems, statutoryAuditChecklistItems } from "@/components/audit-performance/AuditChecklistTemplates";
import { getTasks } from "@/services/taskService";
import { 
  getAuditChecklists, 
  getChecklistItems, 
  createAuditChecklist, 
  updateChecklistItem 
} from "@/services/auditChecklistService";
import { toast } from "sonner";

const AuditPerformance = () => {
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [checklistType, setChecklistType] = useState<"tax" | "statutory">("tax");
  const [checklist, setChecklist] = useState<any>(null);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  // Fetch or create checklist when task and type are selected
  useEffect(() => {
    if (!selectedTask) return;
    
    const fetchOrCreateChecklist = async () => {
      setIsLoading(true);
      try {
        // Check if a checklist already exists for this task and type
        const checklists = await getAuditChecklists(selectedTask);
        const existingChecklist = checklists.find(cl => cl.type === checklistType);
        
        if (existingChecklist) {
          setChecklist(existingChecklist);
          
          // Fetch checklist items
          const items = await getChecklistItems(existingChecklist.id);
          setChecklistItems(items);
        } else {
          // Create a new checklist
          const templateItems = checklistType === "tax" 
            ? taxAuditChecklistItems 
            : statutoryAuditChecklistItems;
          
          const newChecklist = await createAuditChecklist({
            task_id: selectedTask,
            type: checklistType,
            items: templateItems.map(item => ({
              area: item.area,
              procedure: item.procedure,
              responsibility: item.responsibility,
              timeline: item.timeline,
              is_done: false,
              checklist_id: "" // This will be set properly in the backend
            }))
          });
          
          setChecklist(newChecklist);
          
          // Fetch the newly created checklist items
          const items = await getChecklistItems(newChecklist.id);
          setChecklistItems(items);
        }
      } catch (error) {
        console.error("Error fetching or creating checklist:", error);
        toast.error("Failed to load audit checklist");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrCreateChecklist();
  }, [selectedTask, checklistType]);
  
  // Handle task item status update
  const handleItemStatusChange = async (itemId: string, isDone: boolean, remarks?: string) => {
    try {
      await updateChecklistItem(itemId, { is_done: isDone, remarks });
      
      // Update local state
      setChecklistItems(checklistItems.map(item => {
        if (item.id === itemId) {
          return { ...item, is_done: isDone, remarks: remarks || item.remarks };
        }
        return item;
      }));
      
      toast.success("Checklist item updated");
    } catch (error) {
      console.error("Error updating checklist item:", error);
      toast.error("Failed to update checklist item");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-audit-primary">Audit Performance</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audit Checklists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Select Task</label>
                  <Select 
                    value={selectedTask} 
                    onValueChange={setSelectedTask}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name} - {task.client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTask && (
                <Tabs value={checklistType} onValueChange={(val) => setChecklistType(val as "tax" | "statutory")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tax">Tax Audit</TabsTrigger>
                    <TabsTrigger value="statutory">Statutory Audit</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tax">
                    {isLoading ? (
                      <div className="text-center py-8">Loading tax audit checklist...</div>
                    ) : (
                      <AuditChecklist 
                        items={checklistItems} 
                        onItemStatusChange={handleItemStatusChange} 
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="statutory">
                    {isLoading ? (
                      <div className="text-center py-8">Loading statutory audit checklist...</div>
                    ) : (
                      <AuditChecklist 
                        items={checklistItems} 
                        onItemStatusChange={handleItemStatusChange} 
                      />
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuditPerformance;
