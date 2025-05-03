
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/components/clients/ClientsList";
import { Task } from "@/components/tasks/TaskModel";
import { 
  DocumentType,
  ConstitutionType,
  downloadDocument,
  generateManagementRepresentationLetter,
  generateEngagementLetter,
  generateConsentLetter,
  generateAuditPlan
} from "@/services/documentService";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentGeneratorProps {
  clients: Client[];
  tasks: Task[];
  documentType: DocumentType;
}

export function DocumentGenerator({ clients, tasks, documentType }: DocumentGeneratorProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [constitution, setConstitution] = useState<ConstitutionType>("corporate");
  const [additionalData, setAdditionalData] = useState<Record<string, string>>({
    date: new Date().toISOString().split("T")[0],
    financialYearEnded: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selectedClient = clients.find(client => client.id === selectedClientId);
  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  const handleInputChange = (key: string, value: string) => {
    setAdditionalData(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let blob: Blob;
      let filename = "";

      switch(documentType) {
        case "managementRepresentation":
          blob = await generateManagementRepresentationLetter(
            { client: selectedClient, task: selectedTask, additionalData }, 
            constitution
          );
          filename = `${selectedClient.name}_Management_Representation_Letter.docx`;
          break;
        case "engagement":
          blob = await generateEngagementLetter(
            { client: selectedClient, task: selectedTask, additionalData }, 
            constitution
          );
          filename = `${selectedClient.name}_Engagement_Letter.docx`;
          break;
        case "consent":
          blob = await generateConsentLetter(
            { client: selectedClient, task: selectedTask, additionalData }
          );
          filename = `${selectedClient.name}_Consent_Letter.docx`;
          break;
        case "auditPlan":
          blob = await generateAuditPlan(
            { client: selectedClient, task: selectedTask, additionalData }
          );
          filename = `${selectedClient.name}_Audit_Plan.docx`;
          break;
        default:
          throw new Error("Invalid document type");
      }

      downloadDocument(blob, filename);
      
      toast({
        title: "Success",
        description: `Document generated and downloaded successfully`,
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Document type specific fields
  const renderAdditionalFields = () => {
    switch (documentType) {
      case "managementRepresentation":
      case "engagement":
      case "auditPlan":
        return (
          <>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="financialYearEnded">Financial Year Ended</Label>
              <Input
                id="financialYearEnded"
                placeholder="e.g. March 31, 2024"
                value={additionalData.financialYearEnded || (selectedClient?.fiscalYearEnd || "")}
                onChange={(e) => handleInputChange("financialYearEnded", e.target.value)}
              />
            </div>
          </>
        );
      case "consent":
        return (
          <>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="cinNumber">CIN Number</Label>
              <Input
                id="cinNumber"
                placeholder="Company Identification Number"
                value={additionalData.cinNumber || ""}
                onChange={(e) => handleInputChange("cinNumber", e.target.value)}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Show constitution selection for letters that vary by constitution
  const showConstitutionSelect = documentType === "managementRepresentation" || documentType === "engagement";

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="client">Select Client</Label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tasks.length > 0 && (
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="task">Select Related Task (Optional)</Label>
              <Select
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks
                    .filter(task => !selectedClientId || task.client === selectedClient?.name)
                    .map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showConstitutionSelect && (
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="constitution">Constitution Type</Label>
              <Select
                value={constitution}
                onValueChange={(value) => setConstitution(value as ConstitutionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select constitution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporate Entity</SelectItem>
                  <SelectItem value="partnership">Partnership Firm</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                  <SelectItem value="proprietorship">Proprietorship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={additionalData.date || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>

          {renderAdditionalFields()}

          <Button 
            onClick={handleGenerate} 
            disabled={!selectedClientId || loading}
            className="w-full"
            type="button"
          >
            <FileText className="mr-2" size={16} />
            {loading ? "Generating..." : "Generate Document"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
