import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentGenerator } from "@/components/documents/DocumentGenerator";
import { Client } from "@/components/clients/ClientsList";
import { Task } from "@/components/tasks/TaskModel";
import { FileText, File, FilePen, FileX } from "lucide-react";

// Sample client data - in a real app, this would come from an API or context
const sampleClients: Client[] = [
  {
    id: "1",
    name: "ABC Corporation",
    industry: "Manufacturing",
    status: "Active",
    risk: "Medium",
    fiscalYearEnd: "March 31",
    contactPerson: "John Smith",
    constitution: "corporate",
    email: "john@abc.com",
    phone: "9876543210",
    address: "123 Main St, City",
    auditFee: "50000",
    engagementType: "Statutory Audit",
    auditStartDate: "2023-01-15",
    auditCompletionDate: "2023-03-15",
    assignmentStaff: "Jane Doe",
    auditPartner: "Robert Johnson"
  },
  {
    id: "2",
    name: "XYZ Industries",
    industry: "Technology",
    status: "Active",
    risk: "High",
    fiscalYearEnd: "June 30",
    contactPerson: "Jane Doe",
    constitution: "partnership"
  },
  {
    id: "3",
    name: "Acme Ltd",
    industry: "Retail",
    status: "Completed",
    risk: "Low",
    fiscalYearEnd: "March 31",
    contactPerson: "Robert Johnson",
    constitution: "trust"
  },
  {
    id: "4",
    name: "Global Services Inc",
    industry: "Services",
    status: "Active",
    risk: "Medium",
    fiscalYearEnd: "December 31",
    contactPerson: "Sarah Williams",
    constitution: "corporate"
  },
  {
    id: "5",
    name: "Tech Solutions",
    industry: "Technology",
    status: "On Hold",
    risk: "High",
    fiscalYearEnd: "June 30",
    contactPerson: "Mike Brown",
    constitution: "proprietorship"
  }
];

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: "1",
    name: "Statutory Audit",
    client: "ABC Corporation",
    assignee: "Jane Doe",
    status: "In Progress",
    progress: 50,
    deadline: "2023-03-31",
    typeOfService: "Audit",
    sacCode: "998231",
    description: "Annual statutory audit"
  },
  {
    id: "2",
    name: "Tax Audit",
    client: "XYZ Industries",
    assignee: "Robert Johnson",
    status: "Not Started",
    progress: 0,
    deadline: "2023-06-30",
    typeOfService: "Tax",
    sacCode: "998231",
    description: "Tax audit for FY 2022-23"
  },
  {
    id: "3",
    name: "Internal Audit",
    client: "Acme Ltd",
    assignee: "Sarah Williams",
    status: "Complete",
    progress: 100,
    deadline: "2023-03-15",
    typeOfService: "Internal Audit",
    sacCode: "998231",
    description: "Quarterly internal audit"
  }
];

const Documents = () => {
  const [activeTab, setActiveTab] = useState("management");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Documents</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 flex flex-col sm:flex-row w-full sm:w-auto sm:grid sm:grid-cols-4 md:max-w-3xl">
                <TabsTrigger value="management" className="flex items-center gap-2 justify-start sm:justify-center text-xs sm:text-sm">
                  <FileText size={16} />
                  <span>Management Letter</span>
                </TabsTrigger>
                <TabsTrigger value="engagement" className="flex items-center gap-2 justify-start sm:justify-center text-xs sm:text-sm">
                  <FilePen size={16} />
                  <span>Engagement Letter</span>
                </TabsTrigger>
                <TabsTrigger value="consent" className="flex items-center gap-2 justify-start sm:justify-center text-xs sm:text-sm">
                  <File size={16} />
                  <span>Consent Letter</span>
                </TabsTrigger>
                <TabsTrigger value="auditplan" className="flex items-center gap-2 justify-start sm:justify-center text-xs sm:text-sm">
                  <FileX size={16} />
                  <span>Audit Plan</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="management">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Generate a Management Representation Letter based on client details and constitution type.
                  </p>
                  <DocumentGenerator 
                    clients={sampleClients} 
                    tasks={sampleTasks}
                    documentType="managementRepresentation"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="engagement">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Generate an Engagement Letter based on client details and constitution type.
                  </p>
                  <DocumentGenerator 
                    clients={sampleClients} 
                    tasks={sampleTasks}
                    documentType="engagement"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="consent">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Generate a Consent Letter for a corporate client.
                  </p>
                  <DocumentGenerator 
                    clients={sampleClients} 
                    tasks={sampleTasks}
                    documentType="consent"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="auditplan">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Generate an Audit Plan based on client details and audit requirements.
                  </p>
                  <DocumentGenerator 
                    clients={sampleClients} 
                    tasks={sampleTasks}
                    documentType="auditPlan"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
