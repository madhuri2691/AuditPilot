
import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "./TaskModel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { FileExcel, Download, Upload } from "lucide-react";

interface ImportTasksExcelProps {
  onImport: (tasks: Task[]) => void;
}

export function ImportTasksExcel({ onImport }: ImportTasksExcelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile);
      } else {
        setError("Please select an Excel file (.xlsx or .xls)");
        setFile(null);
      }
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Sample Task",
        client: "Client Name",
        assignee: "Staff Name",
        status: "Not Started",
        deadline: "YYYY-MM-DD",
        typeOfService: "Audit/Tax/Advisory",
        sacCode: "998231",
        description: "Task description"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks Template");
    XLSX.writeFile(wb, "tasks_import_template.xlsx");
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    try {
      const data = await readExcel(file);
      
      const validTasks = data.map((row: any) => ({
        id: crypto.randomUUID(),
        name: row.name || "",
        client: row.client || "",
        assignee: row.assignee || "",
        status: validateStatus(row.status) ? row.status : "Not Started",
        progress: row.status === "Complete" ? 100 : 0,
        deadline: row.deadline || new Date().toISOString().split("T")[0],
        typeOfService: row.typeOfService || "",
        sacCode: row.sacCode || "",
        description: row.description || ""
      }));

      if (validTasks.length === 0) {
        setError("No valid tasks found in the spreadsheet");
        return;
      }

      onImport(validTasks);
      setFile(null);
      toast({
        title: "Tasks imported",
        description: `Successfully imported ${validTasks.length} tasks`,
      });
    } catch (err) {
      setError("Failed to process the Excel file. Please check the format.");
      console.error(err);
    }
  };

  const validateStatus = (status: string): boolean => {
    const validStatuses = ["Not Started", "In Progress", "Review", "Complete"];
    return validStatuses.includes(status);
  };

  const readExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" /> Download Template
          </Button>
        </div>
        <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
          <FileExcel className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Upload your Excel file with task details
          </p>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="mt-4"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {file && (
        <div className="flex justify-between items-center bg-muted p-2 rounded">
          <div className="flex items-center">
            <FileExcel className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">{file.name}</span>
          </div>
          <Button onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" /> Import Tasks
          </Button>
        </div>
      )}
    </div>
  );
}
