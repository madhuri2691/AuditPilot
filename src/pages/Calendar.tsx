import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Plus,
  CalendarDays,
  User,
  Filter,
  Calendar as CalendarIcon,
  Trash,
  Edit,
  AlertCircle,
} from "lucide-react";
import { format, addDays, addMonths, startOfWeek, endOfWeek, addHours, isSameDay, eachDayOfInterval, eachHourOfInterval, startOfDay, endOfDay, isBefore, isWithinInterval } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for tasks
const mockTasks = [
  {
    id: "1",
    title: "Prepare Tax Audit Report",
    clientName: "Acme Corporation",
    status: "in-progress",
    priority: "high",
    startDate: addDays(new Date(), -2).toISOString(),
    dueDate: addDays(new Date(), 3).toISOString(),
    assignee: "John Doe",
    description: "Complete the tax audit report for Acme Corp's FY2023.",
  },
  {
    id: "2",
    title: "Financial Statement Review",
    clientName: "GlobalTech Inc.",
    status: "not-started",
    priority: "medium",
    startDate: addDays(new Date(), 1).toISOString(),
    dueDate: addDays(new Date(), 5).toISOString(),
    assignee: "Jane Smith",
    description: "Review quarterly financial statements for compliance and accuracy.",
  },
  {
    id: "3",
    title: "Client Meeting - Audit Planning",
    clientName: "Sunrise Enterprises",
    status: "not-started",
    priority: "medium",
    startDate: addDays(new Date(), 2).toISOString(),
    dueDate: addDays(new Date(), 2).toISOString(),
    assignee: "John Doe",
    description: "Initial planning meeting to discuss audit scope and timeline.",
  },
  {
    id: "4",
    title: "Submit GST Returns",
    clientName: "Local Retailers Ltd.",
    status: "completed",
    priority: "high",
    startDate: addDays(new Date(), -5).toISOString(),
    dueDate: addDays(new Date(), -1).toISOString(),
    assignee: "Mike Johnson",
    description: "Prepare and submit quarterly GST returns before the deadline.",
  },
  {
    id: "5",
    title: "Internal Audit Review",
    clientName: "InfraWorks Corp.",
    status: "in-progress",
    priority: "low",
    startDate: addDays(new Date(), -1).toISOString(),
    dueDate: addDays(new Date(), 4).toISOString(),
    assignee: "Sarah Williams",
    description: "Review internal controls and compliance procedures.",
  },
  {
    id: "6",
    title: "Finalize Engagement Letter",
    clientName: "New Client Inc.",
    status: "not-started",
    priority: "high",
    startDate: addDays(new Date(), 0).toISOString(),
    dueDate: addDays(new Date(), 1).toISOString(),
    assignee: "John Doe",
    description: "Prepare and send the engagement letter for the new client.",
  },
  {
    id: "7",
    title: "Year-End Tax Planning",
    clientName: "Venture Capital LLC",
    status: "not-started",
    priority: "medium",
    startDate: addDays(new Date(), 7).toISOString(),
    dueDate: addDays(new Date(), 14).toISOString(),
    assignee: "Jane Smith",
    description: "Review tax situation and prepare year-end tax planning strategies.",
  },
  {
    id: "8",
    title: "Audit Committee Meeting",
    clientName: "BigCorp Industries",
    status: "in-progress",
    priority: "high",
    startDate: addDays(new Date(), 3).toISOString(),
    dueDate: addDays(new Date(), 3).toISOString(),
    assignee: "Director Team",
    description: "Present audit findings to the client's audit committee.",
  },
];

// Mock data for team members
const mockTeamMembers = [
  { id: "1", name: "John Doe", role: "Senior Auditor" },
  { id: "2", name: "Jane Smith", role: "Manager" },
  { id: "3", name: "Mike Johnson", role: "Junior Auditor" },
  { id: "4", name: "Sarah Williams", role: "Senior Auditor" },
  { id: "5", name: "Director Team", role: "Director" },
];

// Mock data for clients
const mockClients = [
  { id: "1", name: "Acme Corporation", industry: "Manufacturing" },
  { id: "2", name: "GlobalTech Inc.", industry: "Technology" },
  { id: "3", name: "Sunrise Enterprises", industry: "Retail" },
  { id: "4", name: "Local Retailers Ltd.", industry: "Retail" },
  { id: "5", name: "InfraWorks Corp.", industry: "Infrastructure" },
  { id: "6", name: "New Client Inc.", industry: "Services" },
  { id: "7", name: "Venture Capital LLC", industry: "Financial" },
  { id: "8", name: "BigCorp Industries", industry: "Manufacturing" },
];

// Helper function to format date ranges
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isSameDay(start, end)) {
    return format(start, "MMMM d, yyyy");
  }
  
  return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "secondary";
    case "in-progress":
      return "default";
    case "not-started":
    default:
      return "outline";
  }
};

// Helper function to get priority badge variant
const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
    default:
      return "secondary";
  }
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [filters, setFilters] = useState({
    client: "",
    assignee: "",
    status: "",
    priority: "",
  });

  // Handle view change
  const handleViewChange = (view: "month" | "week" | "day") => {
    setCalendarView(view);
  };

  // Handle date navigation
  const handlePreviousClick = () => {
    if (calendarView === "month") {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (calendarView === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNextClick = () => {
    if (calendarView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Handle task selection
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Apply filters
    let filtered = mockTasks;
    
    if (newFilters.client) {
      filtered = filtered.filter(task => task.clientName === newFilters.client);
    }
    
    if (newFilters.assignee) {
      filtered = filtered.filter(task => task.assignee === newFilters.assignee);
    }
    
    if (newFilters.status) {
      filtered = filtered.filter(task => task.status === newFilters.status);
    }
    
    if (newFilters.priority) {
      filtered = filtered.filter(task => task.priority === newFilters.priority);
    }
    
    setFilteredTasks(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      client: "",
      assignee: "",
      status: "",
      priority: "",
    });
    setFilteredTasks(mockTasks);
  };

  // Month view - check if a task falls on a specific day
  const getTasksForDay = (day: Date) => {
    return filteredTasks.filter(task => {
      const startDate = new Date(task.startDate);
      const dueDate = new Date(task.dueDate);
      return isWithinInterval(day, { start: startDate, end: dueDate }) ||
        isSameDay(day, startDate) ||
        isSameDay(day, dueDate);
    });
  };

  // Week view - get days for the current week
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  // Day view - get hours for the current day
  const getDayHours = () => {
    const start = addHours(startOfDay(currentDate), 9); // Start at 9 AM
    const end = addHours(startOfDay(currentDate), 18); // End at 6 PM
    return eachHourOfInterval({ start, end });
  };

  // Get tasks for a specific hour on a specific day
  const getTasksForHour = (day: Date, hour: number) => {
    return filteredTasks.filter(task => {
      const taskDate = new Date(task.startDate);
      return isSameDay(day, taskDate) && taskDate.getHours() === hour;
    });
  };

  // Render day cell for month view
  const renderDayCell = (date: Date) => {
    const day = date.getDate(); // Extract the day number from the date
    
    const tasksForDay = getTasksForDay(date);
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isToday = isSameDay(date, new Date());
    
    return (
      <div 
        className={`h-full min-h-[100px] p-1 border-t ${isCurrentMonth ? "" : "bg-muted text-muted-foreground"} ${isToday ? "bg-muted-foreground/10" : ""}`}
      >
        <div className="flex justify-between">
          <span className={`text-sm font-medium ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}`}>
            {day}
          </span>
          {tasksForDay.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {tasksForDay.length}
            </Badge>
          )}
        </div>
        <ScrollArea className="h-[80px] mt-1">
          <div className="space-y-1 pr-2">
            {tasksForDay.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded cursor-pointer ${
                  task.status === "completed"
                    ? "bg-secondary/50"
                    : task.priority === "high"
                    ? "bg-destructive/20"
                    : "bg-primary/20"
                }`}
                onClick={() => handleTaskClick(task)}
              >
                <div className="truncate font-medium">{task.title}</div>
                <div className="truncate text-[10px]">{task.clientName}</div>
              </div>
            ))}
            {tasksForDay.length > 3 && (
              <div className="text-xs text-muted-foreground text-center">
                +{tasksForDay.length - 3} more
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Calendar</h1>
          <Button onClick={() => setIsAddTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousClick}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextClick}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTodayClick}
                >
                  Today
                </Button>
                <h2 className="text-xl font-semibold">
                  {calendarView === "month"
                    ? format(currentDate, "MMMM yyyy")
                    : calendarView === "week"
                    ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
                    : format(currentDate, "EEEE, MMMM d, yyyy")}
                </h2>
              </div>
              <div className="flex items-center">
                <Tabs value={calendarView} onValueChange={handleViewChange as (value: string) => void} className="mr-4">
                  <TabsList>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Filter Tasks</DialogTitle>
                      <DialogDescription>
                        Customize which tasks are displayed on your calendar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="client-filter" className="text-right">
                          Client
                        </Label>
                        <Select
                          value={filters.client}
                          onValueChange={(value) => handleFilterChange("client", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="All Clients" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Clients</SelectItem>
                            {mockClients.map((client) => (
                              <SelectItem key={client.id} value={client.name}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assignee-filter" className="text-right">
                          Assignee
                        </Label>
                        <Select
                          value={filters.assignee}
                          onValueChange={(value) => handleFilterChange("assignee", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="All Team Members" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Team Members</SelectItem>
                            {mockTeamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.name}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status-filter" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={filters.status}
                          onValueChange={(value) => handleFilterChange("status", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority-filter" className="text-right">
                          Priority
                        </Label>
                        <Select
                          value={filters.priority}
                          onValueChange={(value) => handleFilterChange("priority", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="All Priorities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Priorities</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                      <Button type="submit">Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Month View */}
            {calendarView === "month" && (
              <div>
                <div className="grid grid-cols-7 gap-0">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center py-2 font-medium text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <CalendarComponent
                  mode="multiple"
                  className="border-0"
                  selected={filteredTasks.map(task => new Date(task.dueDate))}
                  month={currentDate}
                  onDayClick={(day) => {
                    setCurrentDate(day);
                    setCalendarView("day");
                  }}
                  components={{
                    Day: ({ date }) => renderDayCell(date),
                  }}
                />
              </div>
            )}

            {/* Week View */}
            {calendarView === "week" && (
              <div>
                <div className="grid grid-cols-7 gap-0">
                  {getWeekDays().map((day, index) => (
                    <div
                      key={index}
                      className={`text-center py-2 font-medium text-sm ${
                        isSameDay(day, new Date()) ? "bg-primary/10 rounded" : ""
                      }`}
                    >
                      <div>{format(day, "EEE")}</div>
                      <div
                        className={`text-lg ${
                          isSameDay(day, new Date())
                            ? "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                            : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0 mt-2">
                  {getWeekDays().map((day, index) => {
                    const tasksForDay = getTasksForDay(day);
                    return (
                      <div
                        key={index}
                        className={`border-t min-h-[500px] ${
                          isSameDay(day, new Date()) ? "bg-primary/10" : ""
                        }`}
                      >
                        <ScrollArea className="h-[500px]">
                          <div className="p-2 space-y-2">
                            {tasksForDay.map((task) => (
                              <div
                                key={task.id}
                                className={`p-2 rounded-md cursor-pointer border ${
                                  task.status === "completed"
                                    ? "bg-secondary/50"
                                    : task.priority === "high"
                                    ? "bg-destructive/20 border-destructive/50"
                                    : "bg-primary/20 border-primary/50"
                                }`}
                                onClick={() => handleTaskClick(task)}
                              >
                                <div className="font-medium text-sm">{task.title}</div>
                                <div className="text-xs mt-1">{task.clientName}</div>
                                <div className="flex items-center mt-1 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(task.startDate), "h:mm a")}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                                    {task.status.replace("-", " ")}
                                  </Badge>
                                  <div className="text-xs">{task.assignee}</div>
                                </div>
                              </div>
                            ))}
                            {tasksForDay.length === 0 && (
                              <div className="text-center text-muted-foreground text-sm py-4">
                                No tasks
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Day View */}
            {calendarView === "day" && (
              <div className="flex flex-col">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">
                    {format(currentDate, "EEEE, MMMM d, yyyy")}
                  </h3>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2">
                  <div className="space-y-8 pt-4">
                    {getDayHours().map((hour, index) => (
                      <div key={index} className="text-right text-sm text-muted-foreground pr-2">
                        {format(hour, "h a")}
                      </div>
                    ))}
                  </div>
                  <div className="border rounded-md">
                    {getDayHours().map((hour, index) => {
                      const tasksForThisHour = getTasksForHour(currentDate, hour.getHours());
                      const allDayTasks = getTasksForDay(currentDate).filter(
                        task => {
                          const startDate = new Date(task.startDate);
                          const dueDate = new Date(task.dueDate);
                          return !isSameDay(startDate, dueDate);
                        }
                      );

                      return (
                        <div
                          key={index}
                          className={`border-t min-h-[60px] ${
                            hour.getHours() === new Date().getHours() &&
                            isSameDay(currentDate, new Date())
                              ? "bg-primary/10"
                              : ""
                          }`}
                        >
                          {index === 0 && allDayTasks.length > 0 && (
                            <div className="p-2 mb-2 border-b bg-muted/50">
                              <div className="text-sm font-medium mb-1">All-day events</div>
                              <div className="space-y-1">
                                {allDayTasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`p-2 rounded-md cursor-pointer border ${
                                      task.status === "completed"
                                        ? "bg-secondary/50"
                                        : task.priority === "high"
                                        ? "bg-destructive/20 border-destructive/50"
                                        : "bg-primary/20 border-primary/50"
                                    }`}
                                    onClick={() => handleTaskClick(task)}
                                  >
                                    <div className="font-medium text-sm">{task.title}</div>
                                    <div className="text-xs mt-1">{task.clientName}</div>
                                    <div className="flex justify-between items-center mt-1">
                                      <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                                        {task.status.replace("-", " ")}
                                      </Badge>
                                      <div className="text-xs">{task.assignee}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="p-2">
                            {tasksForThisHour.map((task) => (
                              <div
                                key={task.id}
                                className={`p-2 rounded-md cursor-pointer border ${
                                  task.status === "completed"
                                    ? "bg-secondary/50"
                                    : task.priority === "high"
                                    ? "bg-destructive/20 border-destructive/50"
                                    : "bg-primary/20 border-primary/50"
                                }`}
                                onClick={() => handleTaskClick(task)}
                              >
                                <div className="font-medium text-sm">{task.title}</div>
                                <div className="text-xs mt-1">{task.clientName}</div>
                                <div className="flex justify-between items-center mt-1">
                                  <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                                    {task.status.replace("-", " ")}
                                  </Badge>
                                  <div className="text-xs">{task.assignee}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Details Dialog */}
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedTask && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <DialogTitle>{selectedTask.title}</DialogTitle>
                    <Badge variant={getPriorityBadgeVariant(selectedTask.priority)}>
                      {selectedTask.priority} priority
                    </Badge>
                  </div>
                  <DialogDescription>
                    {selectedTask.clientName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Status</Label>
                      <div>
                        <Badge variant={getStatusBadgeVariant(selectedTask.status)}>
                          {selectedTask.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Assignee</Label>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-2" />
                        {selectedTask.assignee}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Date Range</Label>
                    <div className="flex items-center mt-1">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatDateRange(selectedTask.startDate, selectedTask.dueDate)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Description</Label>
                    <p className="mt-1 text-sm">{selectedTask.description}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {selectedTask.status !== "completed" ? (
                    <Button size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task or deadline in your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Task title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input type="date" id="start-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input type="date" id="due-date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="not-started">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Task details and notes" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddTaskDialogOpen(false)}>
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This calendar shows audit tasks and deadlines. You can filter by client, team member, 
            status, or priority using the filter button.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
};

export default Calendar;
