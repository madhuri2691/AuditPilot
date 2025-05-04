import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TasksList } from "@/components/tasks/TasksList";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { RunningWorksStatus } from "@/components/dashboard/RunningWorksStatus";
import { QuickAccessTools } from "@/components/dashboard/QuickAccessTools";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { useState, useEffect } from "react";
import { Task } from "@/components/tasks/TaskModel";
import { Client } from "@/components/clients/ClientsList";
import { Link } from "react-router-dom";
import { ArrowRight, CheckSquare, AlertCircle, Bell, BarChart, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

// Sample clients data for demonstration
const sampleClients: Client[] = [
  {
    id: "1",
    name: "ABC Corporation",
    industry: "Manufacturing",
    status: "Active",
    risk: "Medium",
    fiscalYearEnd: "Dec 31",
    contactPerson: "John Smith",
    auditFee: "₹250,000"
  },
  {
    id: "2",
    name: "XYZ Industries",
    industry: "Technology",
    status: "Active",
    risk: "High",
    fiscalYearEnd: "Jun 30",
    contactPerson: "Jane Doe",
    auditFee: "₹350,000"
  },
  {
    id: "3",
    name: "Acme Ltd",
    industry: "Retail",
    status: "Completed",
    risk: "Low",
    fiscalYearEnd: "Mar 31",
    contactPerson: "Robert Johnson",
    auditFee: "₹150,000"
  },
  {
    id: "4",
    name: "Global Services Inc",
    industry: "Services",
    status: "Active",
    risk: "Medium",
    fiscalYearEnd: "Dec 31",
    contactPerson: "Sarah Williams",
    auditFee: "₹220,000"
  },
  {
    id: "5",
    name: "Tech Solutions",
    industry: "Technology",
    status: "On Hold",
    risk: "High",
    fiscalYearEnd: "Jun 30",
    contactPerson: "Mike Brown",
    auditFee: "₹180,000"
  }
];

// Sample engagement milestones data
const sampleMilestones = [
  { 
    clientId: "1", 
    milestones: [
      { name: "Planning", status: "completed" as const, date: "2025-04-01" },
      { name: "Fieldwork", status: "in-progress" as const, date: "2025-04-15" },
      { name: "Review", status: "pending" as const, date: "2025-05-15" },
      { name: "Reporting", status: "pending" as const, date: "2025-06-01" }
    ],
    teamAllocation: [
      { name: "Jane Doe", role: "Manager", hoursAllocated: 80, hoursUsed: 30 },
      { name: "John Smith", role: "Senior", hoursAllocated: 120, hoursUsed: 60 },
      { name: "Robert Johnson", role: "Staff", hoursAllocated: 160, hoursUsed: 50 }
    ]
  },
  { 
    clientId: "2", 
    milestones: [
      { name: "Planning", status: "completed" as const, date: "2025-03-15" },
      { name: "Fieldwork", status: "completed" as const, date: "2025-04-01" },
      { name: "Review", status: "in-progress" as const, date: "2025-04-20" },
      { name: "Reporting", status: "pending" as const, date: "2025-05-10" }
    ],
    teamAllocation: [
      { name: "Jane Doe", role: "Manager", hoursAllocated: 100, hoursUsed: 70 },
      { name: "Mike Wilson", role: "Senior", hoursAllocated: 150, hoursUsed: 120 },
      { name: "Sarah Johnson", role: "Staff", hoursAllocated: 200, hoursUsed: 150 }
    ]
  }
];

// Sample notifications
const sampleNotifications = [
  { 
    id: "1", 
    title: "Deadline Approaching", 
    message: "ABC Corporation audit fieldwork due in 3 days", 
    type: "deadline" as const, 
    date: "2025-04-12", 
    isRead: false 
  },
  { 
    id: "2", 
    title: "Status Update", 
    message: "XYZ Industries moved to review phase", 
    type: "update" as const, 
    date: "2025-04-10", 
    isRead: true 
  },
  { 
    id: "3", 
    title: "New Document", 
    message: "Tech Solutions uploaded financial statements", 
    type: "document" as const, 
    date: "2025-04-09", 
    isRead: false 
  }
];

// Sample quick access tools - updated to include Bill Tracking
const quickAccessTools = [
  { name: "Document Generator", icon: "FileText", path: "/documents", description: "Generate standard documents" },
  { name: "Financial Analysis", icon: "BarChart", path: "/financial-analysis", description: "Analyze financial data" },
  { name: "Sampling Tool", icon: "Search", path: "/sampling", description: "Generate audit samples" },
  { name: "Task Manager", icon: "CheckSquare", path: "/tasks", description: "Manage audit tasks" },
  { name: "Client Portal", icon: "Users", path: "/clients", description: "Access client information" },
  { name: "Bill Tracking", icon: "DollarSign", path: "/bill-tracking", description: "Track invoices and payments" }
];

const Index = () => {
  // State for different task categories
  const [incompleteTasks, setIncompleteTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [unbilledTasks, setUnbilledTasks] = useState<Task[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Initialize task data on component mount
  useEffect(() => {
    // Filter tasks by status
    const incomplete = sampleTasks.filter(task => 
      task.status === "Not Started" || task.status === "In Progress" || task.status === "Review"
    );
    
    const completed = sampleTasks.filter(task => task.status === "Complete");
    
    // For demonstration purposes, we'll consider some completed tasks as unbilled
    const unbilled = completed.filter((_, index) => index === 0); // Just the first completed task
    
    setIncompleteTasks(incomplete);
    setCompletedTasks(completed);
    setUnbilledTasks(unbilled);

    // Count unread notifications
    setUnreadNotifications(sampleNotifications.filter(n => !n.isRead).length);
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
        toast.success("Task marked as complete");
      }
    } else {
      setIncompleteTasks(incompleteTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: status as Task["status"], progress };
        }
        return task;
      }));
      toast.info("Task status updated");
    }
  };
  
  // Function to handle notification reading
  const handleReadNotification = (id: string) => {
    setUnreadNotifications(prev => Math.max(0, prev - 1));
    toast.info("Notification marked as read");
  };

  // Function to handle notification preference update
  const handleUpdateNotificationPreferences = (preferences: any) => {
    console.log("Update notification preferences", preferences);
    toast.success("Notification preferences updated");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-audit-primary">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="relative">
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">Tasks Overview</TabsTrigger>
            <TabsTrigger value="clients">Client List</TabsTrigger>
            <TabsTrigger value="running">Running Works</TabsTrigger>
            <TabsTrigger value="tools">Quick Access</TabsTrigger>
          </TabsList>

          {/* Tasks Overview Tab */}
          <TabsContent value="tasks">
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
          </TabsContent>

          {/* Client List Tab */}
          <TabsContent value="clients">
            <ClientDashboard clients={sampleClients} />
          </TabsContent>

          {/* Running Works Tab */}
          <TabsContent value="running">
            <RunningWorksStatus 
              clients={sampleClients} 
              engagementData={sampleMilestones}
            />
          </TabsContent>

          {/* Quick Access Tools & Notifications Tab */}
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickAccessTools tools={quickAccessTools} />
              <NotificationCenter 
                notifications={sampleNotifications}
                onReadNotification={handleReadNotification}
                onUpdatePreferences={handleUpdateNotificationPreferences}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Index;
