
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Download, Save } from "lucide-react";
import { type AuditChecklist as AuditChecklistType, ChecklistItem } from "./AuditChecklistModel";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateTaxAuditItems, generateStatutoryAuditItems } from "./AuditChecklistTemplates";

interface AuditChecklistProps {
  taskId: string;
  taskName: string;
  clientName: string;
  type: "Tax Audit" | "Statutory Audit";
  onSave?: (checklist: AuditChecklistType) => void;
  existingChecklist?: AuditChecklistType;
}

export function AuditChecklist({
  taskId,
  taskName,
  clientName,
  type,
  onSave,
  existingChecklist,
}: AuditChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [assessmentYear, setAssessmentYear] = useState<string>(existingChecklist?.assessmentYear || "");
  const [financialYear, setFinancialYear] = useState<string>(existingChecklist?.financialYear || "");
  
  // Initialize checklist based on type or load existing
  useEffect(() => {
    if (existingChecklist) {
      setChecklist(existingChecklist.items);
      setAssessmentYear(existingChecklist.assessmentYear || "");
      setFinancialYear(existingChecklist.financialYear || "");
    } else {
      // Generate default checklist based on type
      if (type === "Tax Audit") {
        setChecklist(generateTaxAuditItems());
      } else {
        setChecklist(generateStatutoryAuditItems());
      }
    }
  }, [existingChecklist, type]);
  
  // Calculate completion percentage
  useEffect(() => {
    if (checklist.length === 0) return;
    
    const completedItems = checklist.filter(item => item.isDone).length;
    const percentage = Math.round((completedItems / checklist.length) * 100);
    setCompletionPercentage(percentage);
  }, [checklist]);
  
  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setChecklist(prevList => 
      prevList.map(item => 
        item.id === id ? { ...item, isDone: checked } : item
      )
    );
  };
  
  // Handle remarks change
  const handleRemarksChange = (id: string, remarks: string) => {
    setChecklist(prevList => 
      prevList.map(item => 
        item.id === id ? { ...item, remarks } : item
      )
    );
  };
  
  // Save checklist
  const handleSave = () => {
    if (!taskId || !clientName) {
      toast.error("Task and client information are required");
      return;
    }
    
    const auditChecklist: AuditChecklistType = {
      id: existingChecklist?.id || `checklist_${Date.now()}`,
      taskId,
      taskName,
      clientName,
      type,
      items: checklist,
      startDate: existingChecklist?.startDate || new Date().toISOString(),
      assessmentYear: type === "Tax Audit" ? assessmentYear : undefined,
      financialYear: financialYear,
    };
    
    if (onSave) {
      onSave(auditChecklist);
    }
    
    toast.success("Checklist saved successfully");
  };
  
  // Download as Excel/Word
  const downloadChecklist = (format: "excel" | "word") => {
    // In a real app, this would use a library like xlsx or docx to generate the file
    // For this demo, we'll just simulate the download
    toast.success(`Downloading checklist as ${format.toUpperCase()}`);
    
    // You would use a library like xlsx or docx to generate and download the file
    console.log(`Downloading ${type} checklist for ${clientName} as ${format}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {type} Checklist for {clientName}
          </h3>
          <p className="text-sm text-muted-foreground">Task: {taskName}</p>
        </div>
        
        <div className="flex items-center gap-4">
          {type === "Tax Audit" && (
            <div className="w-40">
              <Input 
                placeholder="Assessment Year" 
                value={assessmentYear}
                onChange={(e) => setAssessmentYear(e.target.value)}
              />
            </div>
          )}
          
          <div className="w-40">
            <Input 
              placeholder="Financial Year" 
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Progress value={completionPercentage} className="h-2 w-full" />
        <span className="text-sm font-medium">{completionPercentage}%</span>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Done</TableHead>
              <TableHead className="w-[200px]">Area of Audit</TableHead>
              <TableHead className="w-[300px]">Audit Procedure</TableHead>
              <TableHead className="w-[120px]">Responsibility</TableHead>
              <TableHead className="w-[120px]">Timeline</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklist.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={item.isDone}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(item.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>{item.area}</TableCell>
                <TableCell>{item.procedure}</TableCell>
                <TableCell>{item.responsibility}</TableCell>
                <TableCell>{item.timeline}</TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add remarks..."
                    value={item.remarks}
                    onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                    className="min-h-8 h-auto"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between">
        <div>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Save Progress
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => downloadChecklist("excel")} 
            className="gap-2"
          >
            <Download size={16} />
            Download as Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => downloadChecklist("word")} 
            className="gap-2"
          >
            <Download size={16} />
            Download as Word
          </Button>
        </div>
      </div>
    </div>
  );
}
