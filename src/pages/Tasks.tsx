import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Download, Upload } from "lucide-react";
import { TasksList } from "@/components/tasks/TasksList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ImportTasksExcel } from "@/components/tasks/ImportTasksExcel";
import { getTasks, addTask, updateTask, Task } from "@/services/taskService";
import { getClients } from "@/services/clientService";

// Sample client data - in a real app, this would come from an API or state
const sampleClients = [
  { id: "1", name: "ABC Corporation" },
  { id: "2", name: "XYZ Industries" },
  { id: "3", name: "Acme Ltd" },
  { id: "4", name: "Global Services Inc" },
  { id: "5", name: "Tech Solutions" },
];

const Tasks = () => {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [addTab, setAddTab] = useState("manual");
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tasksData = await getTasks();
        const clientsData = await getClients();
        
        // Transform clients data for the dropdown
        const formattedClients = clientsData.map(client => ({
          id: client.id,
          name: client.name
        }));
        
        setClients(formattedClients);
        
        // Split tasks into active and completed
        const active = tasksData.filter(task => task.status !== 'Complete');
        const completed = tasksData.filter(task => task.status === 'Complete');
        
        setActiveTasks(active);
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to handle adding a new task
  const handleAddTask = async (task: Task) => {
    try {
      const newTask = await addTask(task);
      
      if (newTask.status === "Complete") {
        setCompletedTasks([newTask, ...completedTasks]);
      } else {
        setActiveTasks([newTask, ...activeTasks]);
      }
      
      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  // Function to handle adding multiple tasks (from import)
  const handleImportTasks = async (tasks: Task[]) => {
    try {
      const promises = tasks.map(task => addTask(task));
      await Promise.allSettled(promises);
      
      // Refresh task lists
      const tasksData = await getTasks();
      const active = tasksData.filter(task => task.status !== 'Complete');
      const completed = tasksData.filter(task => task.status === 'Complete');
      
      setActiveTasks(active);
      setCompletedTasks(completed);
    } catch (error) {
      console.error("Error importing tasks:", error);
    }
  };

  // Function to handle updating task status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: string, progress: number) => {
    try {
      const taskToUpdate = activeTasks.find(task => task.id === taskId) || 
                          completedTasks.find(task => task.id === taskId);
      
      if (!taskToUpdate) return;
      
      const updatedTask = await updateTask(taskId, { 
        status: newStatus as Task["status"],
        progress 
      });
      
      // If task is marked as complete, move to completed list
      if (newStatus === "Complete") {
        setActiveTasks(activeTasks.filter(task => task.id !== taskId));
        setCompletedTasks([updatedTask, ...completedTasks]);
      } else {
        // Otherwise just update the status
        setActiveTasks(activeTasks.map(task => {
          if (task.id === taskId) {
            return { 
              ...task, 
              status: newStatus as Task["status"], 
              progress 
            };
          }
          return task;
        }));
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Function to move a completed task back to active
  const handleReactivateTask = async (taskId: string) => {
    try {
      const taskToMove = completedTasks.find(task => task.id === taskId);
      
      if (!taskToMove) return;
      
      const updatedTask = await updateTask(taskId, { 
        status: "In Progress" as Task["status"], 
        progress: 50 
      });
      
      setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
      setActiveTasks([updatedTask, ...activeTasks]);
    } catch (error) {
      console.error("Error reactivating task:", error);
    }
  };

  // Filter tasks based on search query
  const filteredActiveTasks = activeTasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.client && task.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompletedTasks = completedTasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.client && task.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Tasks</h1>
          <div className="flex gap-2">
            <Button onClick={() => setAddTab("manual")}>
              <Plus className="mr-2 h-4 w-4" /> Create New Task
            </Button>
            <Button variant="outline" onClick={() => setAddTab("import")}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Task Add/Import Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={addTab} onValueChange={setAddTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="import">Import from Excel</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <TaskForm onSubmit={handleAddTask} clients={clients} />
              </TabsContent>
              <TabsContent value="import">
                <ImportTasksExcel onImport={handleImportTasks} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Task Lists Card */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Task List</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Tasks</TabsTrigger>
                <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                {isLoading ? (
                  <div className="text-center py-4">Loading tasks...</div>
                ) : (
                  <TasksList 
                    tasks={filteredActiveTasks} 
                    onUpdateStatus={handleUpdateTaskStatus} 
                    showInvoice={false}
                  />
                )}
              </TabsContent>
              <TabsContent value="completed">
                {isLoading ? (
                  <div className="text-center py-4">Loading tasks...</div>
                ) : (
                  <TasksList 
                    tasks={filteredCompletedTasks} 
                    onUpdateStatus={handleReactivateTask} 
                    showInvoice={true}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Tasks;
