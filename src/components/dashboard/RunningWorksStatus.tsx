
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/components/clients/ClientsList";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface Milestone {
  name: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
}

interface TeamMember {
  name: string;
  role: string;
  hoursAllocated: number;
  hoursUsed: number;
}

interface EngagementData {
  clientId: string;
  milestones: Milestone[];
  teamAllocation: TeamMember[];
}

interface RunningWorksStatusProps {
  clients: Client[];
  engagementData: EngagementData[];
}

export function RunningWorksStatus({ clients, engagementData }: RunningWorksStatusProps) {
  const [selectedClient, setSelectedClient] = useState<string>(clients[0]?.id || "");

  // Get data for selected client
  const clientData = engagementData.find(data => data.clientId === selectedClient);
  const client = clients.find(c => c.id === selectedClient);

  // Calculate overall progress
  const calculateOverallProgress = (milestones: Milestone[]) => {
    if (!milestones || milestones.length === 0) return 0;
    
    const completed = milestones.filter(m => m.status === "completed").length;
    const inProgress = milestones.filter(m => m.status === "in-progress").length;
    
    return Math.round((completed + (inProgress * 0.5)) / milestones.length * 100);
  };

  // Calculate progress for each team member
  const calculateResourceUsage = (member: TeamMember) => {
    return Math.round((member.hoursUsed / member.hoursAllocated) * 100);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Running Works & Status</CardTitle>
          <Select
            value={selectedClient}
            onValueChange={setSelectedClient}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients
                .filter(c => c.status === "Active")
                .map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {client ? `${client.name} - ${client.industry}` : "Select a client to view their audit progress"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clientData ? (
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Engagement Timeline</TabsTrigger>
              <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Overall Progress</Badge>
                    <span className="font-medium">{calculateOverallProgress(clientData.milestones)}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Progress value={calculateOverallProgress(clientData.milestones)} className="h-2" />
                
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute left-2 top-0 w-[1px] h-full bg-muted"></div>
                    
                    {clientData.milestones.map((milestone, index) => (
                      <div key={index} className="relative pl-10 pb-10 last:pb-0">
                        <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white ${
                          milestone.status === "completed" ? "bg-green-500" :
                          milestone.status === "in-progress" ? "bg-blue-500" : "bg-gray-300"
                        }`}></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-medium">{milestone.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                milestone.status === "completed" ? "secondary" :
                                milestone.status === "in-progress" ? "default" : "outline"
                              }>
                                {milestone.status === "completed" ? "Completed" :
                                 milestone.status === "in-progress" ? "In Progress" : "Pending"}
                              </Badge>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar size={14} className="mr-1" />
                                {milestone.date}
                              </div>
                            </div>
                          </div>
                          
                          {milestone.status === "completed" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              ✓ Done
                            </Badge>
                          )}
                          
                          {milestone.status === "in-progress" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                              In Progress
                            </Badge>
                          )}
                          
                          {milestone.status === "pending" && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500 hover:bg-gray-50">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Team Resource Allocation</h3>
                
                <div className="space-y-4">
                  {clientData.teamAllocation.map((member, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{member.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">({member.role})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} />
                          <span>{member.hoursUsed}/{member.hoursAllocated} hours</span>
                          <Badge variant={calculateResourceUsage(member) > 90 ? "destructive" : "outline"}>
                            {calculateResourceUsage(member)}%
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress 
                        value={calculateResourceUsage(member)} 
                        className={`h-2 ${
                          calculateResourceUsage(member) > 90 ? "bg-red-100" : 
                          calculateResourceUsage(member) > 75 ? "bg-yellow-100" : ""
                        }`} 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-medium mb-2">Total Resources</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {clientData.teamAllocation.reduce((sum, member) => sum + member.hoursAllocated, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Hours Allocated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {clientData.teamAllocation.reduce((sum, member) => sum + member.hoursUsed, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Hours Used</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(
                          (clientData.teamAllocation.reduce((sum, member) => sum + member.hoursUsed, 0) / 
                          clientData.teamAllocation.reduce((sum, member) => sum + member.hoursAllocated, 0)) * 100
                        )}%
                      </div>
                      <div className="text-xs text-muted-foreground">Utilization</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No engagement data available for the selected client
          </div>
        )}
      </CardContent>
    </Card>
  );
}
