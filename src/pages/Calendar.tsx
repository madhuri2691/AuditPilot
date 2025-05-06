
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Calendar as CalendarIcon,
  Users,
  CheckSquare,
  MoreHorizontal,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays, startOfWeek, endOfWeek, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";

// Sample data for calendar events
const events = [
  {
    id: 1,
    title: "Tax Audit - ABC Corp",
    date: addDays(new Date(), 2),
    time: "10:00 AM - 12:00 PM",
    type: "client-meeting",
    client: "ABC Corporation",
    status: "scheduled",
    priority: "high",
  },
  {
    id: 2,
    title: "Financial Statement Review",
    date: addDays(new Date(), 3),
    time: "2:00 PM - 4:00 PM",
    type: "internal",
    status: "scheduled",
    priority: "medium",
  },
  {
    id: 3,
    title: "Quarterly Filing Deadline",
    date: addDays(new Date(), 5),
    time: "11:59 PM",
    type: "deadline",
    status: "pending",
    priority: "high",
  },
  {
    id: 4,
    title: "Client Onboarding - XYZ Ltd",
    date: addDays(new Date(), 1),
    time: "9:00 AM - 10:30 AM",
    type: "client-meeting",
    client: "XYZ Limited",
    status: "scheduled",
    priority: "medium",
  },
  {
    id: 5,
    title: "Team Discussion - Audit Strategy",
    date: new Date(),
    time: "3:00 PM - 4:00 PM",
    type: "internal",
    status: "scheduled",
    priority: "low",
  },
  {
    id: 6,
    title: "GST Filing Deadline",
    date: addDays(new Date(), -1),
    time: "11:59 PM",
    type: "deadline",
    status: "overdue",
    priority: "high",
  },
];

// Sample tasks
const tasks = [
  {
    id: 101,
    title: "Complete ABC Corp Audit Planning",
    deadline: addDays(new Date(), 2),
    status: "in-progress",
    priority: "high",
    client: "ABC Corporation",
    assignee: "John Doe",
  },
  {
    id: 102,
    title: "Review XYZ Financial Statements",
    deadline: addDays(new Date(), 5),
    status: "not-started",
    priority: "medium",
    client: "XYZ Limited",
    assignee: "Jane Smith",
  },
  {
    id: 103,
    title: "Prepare Tax Analysis Report",
    deadline: addDays(new Date(), 10),
    status: "in-progress",
    priority: "medium",
    client: "123 Industries",
    assignee: "Robert Johnson",
  },
  {
    id: 104,
    title: "Submit Quarterly GST Returns",
    deadline: addDays(new Date(), -1),
    status: "overdue",
    priority: "high",
    client: "Multiple Clients",
    assignee: "John Doe",
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState({
    showTasks: true,
    showMeetings: true,
    showDeadlines: true,
    showCompleted: false,
    clientFilter: "all",
    assigneeFilter: "all",
  });

  const handlePrevious = () => {
    if (view === "month") {
      setDate(subMonths(date, 1));
    } else if (view === "week") {
      setDate(subWeeks(date, 1));
    } else {
      setDate(addDays(date, -1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setDate(addMonths(date, 1));
    } else if (view === "week") {
      setDate(addWeeks(date, 1));
    } else {
      setDate(addDays(date, 1));
    }
  };

  const handleToday = () => {
    setDate(new Date());
    setSelectedDate(new Date());
  };

  const filteredEvents = events.filter((event) => {
    if (event.type === "deadline" && !filter.showDeadlines) return false;
    if (event.type === "client-meeting" && !filter.showMeetings) return false;
    if (event.type === "internal" && !filter.showMeetings) return false;
    if (event.status === "completed" && !filter.showCompleted) return false;
    if (filter.clientFilter !== "all" && event.client !== filter.clientFilter) return false;
    return true;
  });

  const filteredTasks = tasks.filter((task) => {
    if (!filter.showTasks) return false;
    if (task.status === "completed" && !filter.showCompleted) return false;
    if (filter.clientFilter !== "all" && task.client !== filter.clientFilter) return false;
    if (filter.assigneeFilter !== "all" && task.assignee !== filter.assigneeFilter) return false;
    return true;
  });

  // Get events for the selected date
  const selectedDateEvents = filteredEvents.filter(
    (event) => format(event.date, "yyyy-MM-dd") === format(selectedDate!, "yyyy-MM-dd")
  );

  // Get tasks due on the selected date
  const selectedDateTasks = filteredTasks.filter(
    (task) => format(task.deadline, "yyyy-MM-dd") === format(selectedDate!, "yyyy-MM-dd")
  );

  const getMonthViewTitle = () => {
    return format(date, "MMMM yyyy");
  };

  const getWeekViewTitle = () => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const getDayViewTitle = () => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const getViewTitle = () => {
    switch (view) {
      case "month":
        return getMonthViewTitle();
      case "week":
        return getWeekViewTitle();
      case "day":
        return getDayViewTitle();
      default:
        return "";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "not-started":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getEventTypeColor = (type: string, status: string) => {
    if (status === "overdue") {
      return "border-red-500 bg-red-50 text-red-800";
    }
    
    switch (type) {
      case "client-meeting":
        return "border-blue-500 bg-blue-50 text-blue-800";
      case "internal":
        return "border-purple-500 bg-purple-50 text-purple-800";
      case "deadline":
        return "border-amber-500 bg-amber-50 text-amber-800";
      default:
        return "border-gray-500 bg-gray-50 text-gray-800";
    }
  };

  const getDayContent = (day: Date) => {
    const dayEvents = filteredEvents.filter(
      (event) => format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
    
    const dayTasks = filteredTasks.filter(
      (task) => format(task.deadline, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
    
    const totalItems = dayEvents.length + dayTasks.length;
    
    if (totalItems === 0) return null;
    
    const hasOverdue = dayEvents.some(e => e.status === "overdue") || 
                      dayTasks.some(t => t.status === "overdue");
    
    const hasHighPriority = dayEvents.some(e => e.priority === "high") || 
                           dayTasks.some(t => t.priority === "high");
    
    return (
      <div className="flex flex-col items-center mt-1">
        {hasOverdue && <div className="w-2 h-2 rounded-full bg-red-500 mb-1"></div>}
        {!hasOverdue && hasHighPriority && <div className="w-2 h-2 rounded-full bg-amber-500 mb-1"></div>}
        <div className="text-xs font-semibold">
          {totalItems > 0 && totalItems}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Calendar</h1>
          
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Calendar</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-tasks" 
                        checked={filter.showTasks}
                        onCheckedChange={(checked) => 
                          setFilter({...filter, showTasks: Boolean(checked)})
                        }
                      />
                      <label htmlFor="show-tasks" className="text-sm font-medium">
                        Show Tasks
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-meetings" 
                        checked={filter.showMeetings}
                        onCheckedChange={(checked) => 
                          setFilter({...filter, showMeetings: Boolean(checked)})
                        }
                      />
                      <label htmlFor="show-meetings" className="text-sm font-medium">
                        Show Meetings
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-deadlines" 
                        checked={filter.showDeadlines}
                        onCheckedChange={(checked) => 
                          setFilter({...filter, showDeadlines: Boolean(checked)})
                        }
                      />
                      <label htmlFor="show-deadlines" className="text-sm font-medium">
                        Show Deadlines
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-completed" 
                        checked={filter.showCompleted}
                        onCheckedChange={(checked) => 
                          setFilter({...filter, showCompleted: Boolean(checked)})
                        }
                      />
                      <label htmlFor="show-completed" className="text-sm font-medium">
                        Show Completed
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client:</label>
                    <Select
                      value={filter.clientFilter}
                      onValueChange={(value) => 
                        setFilter({...filter, clientFilter: value})
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        <SelectItem value="ABC Corporation">ABC Corporation</SelectItem>
                        <SelectItem value="XYZ Limited">XYZ Limited</SelectItem>
                        <SelectItem value="123 Industries">123 Industries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assignee:</label>
                    <Select
                      value={filter.assigneeFilter}
                      onValueChange={(value) => 
                        setFilter({...filter, assigneeFilter: value})
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Team Members</SelectItem>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        <SelectItem value="Robert Johnson">Robert Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFilter({
                        showTasks: true,
                        showMeetings: true,
                        showDeadlines: true,
                        showCompleted: false,
                        clientFilter: "all",
                        assigneeFilter: "all",
                      })}
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        // Apply filters (already done via state)
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={view} onValueChange={(value) => setView(value as any)}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <Card className="md:col-span-5">
            <CardHeader className="pb-2">
              <CardTitle>{getViewTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              {view === "month" && (
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={date}
                  onMonthChange={setDate}
                  className="rounded-md border p-3 pointer-events-auto"
                  components={{
                    DayContent: ({ day }) => (
                      <>
                        {format(day, "d")}
                        {getDayContent(day)}
                      </>
                    ),
                  }}
                />
              )}
              
              {view === "week" && (
                <div className="border rounded-md h-96 overflow-auto">
                  <div className="grid grid-cols-7 border-b">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const day = addDays(startOfWeek(date), i);
                      return (
                        <div 
                          key={i} 
                          className={`p-2 text-center ${
                            format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <div className="font-medium">{format(day, "EEE")}</div>
                          <div className="text-sm">{format(day, "d")}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-7 h-full">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const day = addDays(startOfWeek(date), i);
                      const dayEvents = filteredEvents.filter(
                        (event) => format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                      );
                      const dayTasks = filteredTasks.filter(
                        (task) => format(task.deadline, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                      );
                      
                      return (
                        <div
                          key={i}
                          className={`border-r p-1 overflow-y-auto ${
                            format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`p-1 mb-1 text-xs rounded border-l-2 ${getEventTypeColor(event.type, event.status)}`}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div>{event.time}</div>
                            </div>
                          ))}
                          
                          {dayTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-1 mb-1 text-xs rounded border-l-2 border-gray-500 bg-gray-50`}
                            >
                              <div className="font-medium">{task.title}</div>
                              <div className="flex items-center">
                                <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {view === "day" && (
                <div className="border rounded-md h-96 overflow-auto">
                  <div className="p-2 text-center border-b font-medium">
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="p-2 space-y-2">
                    {filteredEvents
                      .filter((event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 mb-2 rounded border-l-4 ${getEventTypeColor(event.type, event.status)}`}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">{event.time}</div>
                            <Badge variant="outline">
                              {event.type === "client-meeting" ? "Meeting" : 
                               event.type === "deadline" ? "Deadline" : "Internal"}
                            </Badge>
                          </div>
                          {event.client && (
                            <div className="text-sm text-gray-600 mt-1">
                              Client: {event.client}
                            </div>
                          )}
                        </div>
                      ))}
                    
                    {filteredTasks
                      .filter((task) => format(task.deadline, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                      .map((task) => (
                        <div
                          key={task.id}
                          className="p-2 mb-2 rounded border-l-4 border-gray-400 bg-gray-50"
                        >
                          <div className="font-medium">{task.title}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Due: {format(task.deadline, "MMM d, yyyy")}</div>
                            <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <div>Client: {task.client}</div>
                            <div>Assignee: {task.assignee}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Day"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 && selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No events or tasks scheduled for this day
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Calendar className="mr-2 h-4 w-4" /> Events
                      </h3>
                      <div className="space-y-2">
                        {selectedDateEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 rounded-md border ${
                              event.status === "overdue" ? "border-red-500" : "border-gray-200"
                            }`}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" /> {event.time}
                              </div>
                              <Badge variant="outline">
                                {event.type === "client-meeting" ? "Meeting" : 
                                event.type === "deadline" ? "Deadline" : "Internal"}
                              </Badge>
                            </div>
                            {event.client && (
                              <div className="text-sm text-gray-600 mt-1 flex items-center">
                                <Users className="mr-1 h-3 w-3" /> {event.client}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDateTasks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <CheckSquare className="mr-2 h-4 w-4" /> Tasks Due
                      </h3>
                      <div className="space-y-2">
                        {selectedDateTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-2 rounded-md border ${
                              task.status === "overdue" ? "border-red-500" : "border-gray-200"
                            }`}
                          >
                            <div className="font-medium">
                              {task.title}
                              {task.status === "overdue" && (
                                <AlertTriangle className="h-3 w-3 text-red-500 inline ml-1" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`${
                                  task.priority === "high"
                                    ? "bg-red-50 text-red-700"
                                    : task.priority === "medium"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-green-50 text-green-700"
                                }`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 mt-1 flex justify-between">
                              <div className="flex items-center">
                                <Users className="mr-1 h-3 w-3" /> {task.client}
                              </div>
                              <div className="flex items-center">
                                Assignee: {task.assignee}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" /> View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
