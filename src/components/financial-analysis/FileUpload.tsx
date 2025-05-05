
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { TrialBalanceItem } from "@/pages/FinancialAnalysis";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataProcessed: (data: TrialBalanceItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface ColumnMapping {
  accountCode: string;
  accountDescription: string;
  currentYearBalance: string;
  priorYearBalance: string;
}

export function FileUpload({ onDataProcessed, isLoading, setIsLoading }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    accountCode: "",
    accountDescription: "",
    currentYearBalance: "",
    priorYearBalance: ""
  });
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    // Validate file type
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ];
    
    if (!fileTypes.includes(selectedFile.type)) {
      toast.error("Please upload an Excel or CSV file.");
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  // Parse the uploaded file to get headers and preview data
  const parseFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      // Get the first worksheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        toast.error("The file appears to be empty or has insufficient data");
        setIsLoading(false);
        return;
      }
      
      // Extract headers (first row)
      const fileHeaders = jsonData[0] as string[];
      setHeaders(fileHeaders);
      
      // Set preview data (first few rows)
      const preview = jsonData.slice(1, 6) as any[];
      setPreviewData(preview);
      
      // Try to automatically detect column mappings
      const mappings: ColumnMapping = {
        accountCode: "",
        accountDescription: "",
        currentYearBalance: "",
        priorYearBalance: ""
      };
      
      fileHeaders.forEach((header, index) => {
        const headerLower = header.toLowerCase();
        
        if (headerLower.includes("code") || headerLower.includes("number") || headerLower === "id") {
          mappings.accountCode = header;
        } 
        else if (headerLower.includes("desc") || headerLower.includes("name")) {
          mappings.accountDescription = header;
        }
        else if (headerLower.includes("current") || headerLower.includes("this year")) {
          mappings.currentYearBalance = header;
        }
        else if (headerLower.includes("prior") || headerLower.includes("previous") || headerLower.includes("last year")) {
          mappings.priorYearBalance = header;
        }
      });
      
      setColumnMapping(mappings);
      
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Failed to parse the file. Please check the format and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process the data with the selected column mappings
  const processData = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }
    
    if (!columnMapping.accountCode || !columnMapping.accountDescription || 
        !columnMapping.currentYearBalance || !columnMapping.priorYearBalance) {
      toast.error("Please map all required columns");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const mappedData: TrialBalanceItem[] = jsonData.map((row: any) => {
        const currentYearBalance = parseFloat(row[columnMapping.currentYearBalance]) || 0;
        const priorYearBalance = parseFloat(row[columnMapping.priorYearBalance]) || 0;
        
        // Calculate variance
        const variance = currentYearBalance - priorYearBalance;
        
        // Calculate variance percentage (handle division by zero)
        let variancePercentage = 0;
        if (priorYearBalance !== 0) {
          variancePercentage = (variance / Math.abs(priorYearBalance)) * 100;
        } else if (currentYearBalance !== 0) {
          // If prior year is zero but current year isn't, it's a 100% increase
          variancePercentage = currentYearBalance > 0 ? 100 : -100;
        }
        
        return {
          accountCode: row[columnMapping.accountCode]?.toString() || "",
          accountDescription: row[columnMapping.accountDescription]?.toString() || "",
          currentYearBalance,
          priorYearBalance,
          variance,
          variancePercentage,
          flag: "none" as const
        };
      });
      
      onDataProcessed(mappedData);
      
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("Failed to process the data. Please check the file and mappings.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadTemplate = () => {
    try {
      // Create a simple template
      const templateData = [
        ["Account Code", "Account Description", "Balance (Current Year)", "Balance (Prior Year)"],
        ["1000", "Cash", 50000, 45000],
        ["1100", "Accounts Receivable", 125000, 100000],
        ["2000", "Accounts Payable", 75000, 60000],
      ];
      
      // Create a worksheet
      const ws = XLSX.utils.aoa_to_sheet(templateData);
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      
      // Generate Excel file
      XLSX.writeFile(wb, "trial_balance_template.xlsx");
      
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template");
    }
  };
  
  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      parseFile(droppedFile);
    }
  };
  
  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* File upload area */}
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
      >
        <Input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
        />
        <Label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload size={40} className="text-muted-foreground" />
            <h3 className="font-medium">Drop your file here or click to browse</h3>
            <p className="text-sm text-muted-foreground">
              Accepts Excel (.xlsx, .xls) or CSV files
            </p>
          </div>
        </Label>
      </div>
      
      {/* Download template button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={downloadTemplate} disabled={isLoading} className="gap-2">
          <Download size={16} />
          Download Template
        </Button>
      </div>
      
      {/* File preview and column mapping */}
      {file && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText size={20} />
                <span className="font-medium">{file.name}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
                <div>
                  <Label htmlFor="account-code">Account Code Column</Label>
                  <select
                    id="account-code"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={columnMapping.accountCode}
                    onChange={(e) => setColumnMapping({...columnMapping, accountCode: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="account-desc">Account Description Column</Label>
                  <select
                    id="account-desc"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={columnMapping.accountDescription}
                    onChange={(e) => setColumnMapping({...columnMapping, accountDescription: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="current-year">Current Year Balance Column</Label>
                  <select
                    id="current-year"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={columnMapping.currentYearBalance}
                    onChange={(e) => setColumnMapping({...columnMapping, currentYearBalance: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="prior-year">Prior Year Balance Column</Label>
                  <select
                    id="prior-year"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={columnMapping.priorYearBalance}
                    onChange={(e) => setColumnMapping({...columnMapping, priorYearBalance: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Data preview */}
              {previewData.length > 0 && (
                <div className="overflow-x-auto">
                  <h3 className="font-medium mb-2">Data Preview (First 5 Rows)</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        {headers.map((header, index) => (
                          <th key={index} className="border px-2 py-1 text-left text-sm">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {headers.map((header, colIndex) => (
                            <td key={colIndex} className="border px-2 py-1 text-sm">
                              {row[colIndex] !== undefined ? row[colIndex].toString() : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Process button */}
              <div className="flex justify-end">
                <Button 
                  onClick={processData} 
                  disabled={isLoading || !file || !columnMapping.accountCode || !columnMapping.accountDescription || !columnMapping.currentYearBalance || !columnMapping.priorYearBalance}
                >
                  {isLoading ? "Processing..." : "Process Data"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Alert for help */}
      <Alert>
        <AlertDescription>
          Upload your trial balance data in Excel or CSV format. The tool will help you compare current and prior year balances and identify significant variances.
        </AlertDescription>
      </Alert>
    </div>
  );
}
