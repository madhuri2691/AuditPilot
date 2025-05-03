
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Download, 
  Check, 
  Clock, 
  ArrowRight,
  FileText,
  Users,
  Database
} from "lucide-react";
import { ClientsList } from "@/components/clients/ClientsList";
import { TasksList } from "@/components/tasks/TasksList";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Dashboard</h1>
          <div className="flex gap-2">
            <Button>
              <Check className="mr-2 h-4 w-4" /> Complete Audit
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Generate Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Engagements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground mt-1">5 near deadline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">3 completed this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="clients">Client List</TabsTrigger>
            <TabsTrigger value="works">Running Works & Status</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="clients">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Clients</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search clients..."
                          className="pl-10 pr-4 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ClientsList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="works">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Running Works</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search tasks..."
                          className="pl-10 pr-4 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TasksList />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { client: "ABC Corp", task: "Financial Statement Review", date: "2025-05-10", status: "In Progress" },
                  { client: "XYZ Industries", task: "Audit Planning", date: "2025-05-15", status: "Not Started" },
                  { client: "Acme Ltd", task: "Management Letter", date: "2025-05-20", status: "In Progress" }
                ].map((deadline) => (
                  <div key={`${deadline.client}-${deadline.task}`} className="flex items-center justify-between p-2 hover:bg-muted/40 rounded-md">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{deadline.task}</span>
                      <span className="text-xs text-muted-foreground">{deadline.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={deadline.status === "In Progress" ? "secondary" : "outline"}>
                        {deadline.status === "In Progress" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : null}
                        {deadline.status}
                      </Badge>
                      <span className="text-xs">{deadline.date}</span>
                      <Button variant="ghost" size="icon">
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-xs">Generate Reports</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-xs">Assign Tasks</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                  <Database className="h-6 w-6 mb-2" />
                  <span className="text-xs">Financial Tools</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                  <Search className="h-6 w-6 mb-2" />
                  <span className="text-xs">Sampling</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
