
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { TransactionItem, SamplingModuleType } from "./SamplingTool";

interface FileUploadProps {
  moduleType: SamplingModuleType;
  onDataUploaded: (data: TransactionItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface ColumnMapping {
  id: string;
  date: string;
  amount: string;
  description: string;
  [key: string]: string; // For module-specific fields
}

export function FileUpload({ moduleType, onDataUploaded, isLoading, setIsLoading }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    id: "",
    date: "",
    amount: "",
    description: ""
  });

  // Get module-specific fields for column mapping
  const getModuleSpecificFields = (): {[key: string]: string} => {
    switch (moduleType) {
      case "purchase":
        return {
          vendor: "",
          invoiceNumber: ""
        };
      case "sales":
        return {
          customer: "",
          invoiceNumber: ""
        };
      case "expense":
        return {
          category: "",
          paymentMethod: ""
        };
      default:
        return {};
    }
  };

  // Initialize column mapping with module-specific fields
  useState(() => {
    setColumnMapping({
      ...columnMapping,
      ...getModuleSpecificFields()
    });
  });

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

  // Parse the uploaded file
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
      const mappings: {[key: string]: string} = {
        id: "",
        date: "",
        amount: "",
        description: ""
      };
      
      // Add module-specific fields
      const specificFields = getModuleSpecificFields();
      Object.keys(specificFields).forEach(key => {
        mappings[key] = "";
      });
      
      fileHeaders.forEach((header) => {
        const headerLower = header.toLowerCase();
        
        if (headerLower.includes("id") || headerLower.includes("number") || headerLower === "ref") {
          mappings.id = header;
        } 
        else if (headerLower.includes("date")) {
          mappings.date = header;
        }
        else if (headerLower.includes("amount") || headerLower.includes("value") || headerLower.includes("price")) {
          mappings.amount = header;
        }
        else if (headerLower.includes("desc") || headerLower.includes("narr")) {
          mappings.description = header;
        }
        
        // Module-specific mappings
        if (moduleType === "purchase" || moduleType === "sales") {
          if (headerLower.includes("invoice")) {
            mappings.invoiceNumber = header;
          }
          
          if (moduleType === "purchase" && (headerLower.includes("vendor") || headerLower.includes("supplier"))) {
            mappings.vendor = header;
          }
          
          if (moduleType === "sales" && (headerLower.includes("customer") || headerLower.includes("client"))) {
            mappings.customer = header;
          }
        }
        
        if (moduleType === "expense") {
          if (headerLower.includes("category") || headerLower.includes("type")) {
            mappings.category = header;
          }
          
          if (headerLower.includes("payment") || headerLower.includes("method")) {
            mappings.paymentMethod = header;
          }
        }
      });
      
      setColumnMapping(mappings as ColumnMapping);
      
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Failed to parse the file. Please check the format and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process data with selected column mappings
  const processData = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }
    
    // Check if required fields are mapped
    const requiredFields = ["id", "date", "amount"];
    const missingFields = requiredFields.filter(field => !columnMapping[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please map required columns: ${missingFields.join(", ")}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const mappedData: TransactionItem[] = jsonData.map((row: any, index) => {
        // Create a base transaction item
        const item: TransactionItem = {
          id: row[columnMapping.id]?.toString() || `ROW-${index + 2}`,  // Fallback to row number if ID not available
          date: row[columnMapping.date]?.toString() || "",
          amount: parseFloat(row[columnMapping.amount]) || 0,
          description: row[columnMapping.description]?.toString() || ""
        };
        
        // Add module-specific fields
        if (moduleType === "purchase") {
          item.vendor = row[columnMapping.vendor]?.toString() || "";
          item.invoiceNumber = row[columnMapping.invoiceNumber]?.toString() || "";
        } else if (moduleType === "sales") {
          item.customer = row[columnMapping.customer]?.toString() || "";
          item.invoiceNumber = row[columnMapping.invoiceNumber]?.toString() || "";
        } else if (moduleType === "expense") {
          item.category = row[columnMapping.category]?.toString() || "";
          item.paymentMethod = row[columnMapping.paymentMethod]?.toString() || "";
        }
        
        return item;
      });
      
      // Process the data and notify parent component
      onDataUploaded(mappedData);
      
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("Failed to process the data. Please check the file and mappings.");
    } finally {
      setIsLoading(false);
    }
  };

  // Download template based on module type
  const downloadTemplate = () => {
    try {
      // Create headers based on module type
      let headers: string[] = ["Transaction ID", "Date", "Amount", "Description"];
      
      if (moduleType === "purchase") {
        headers = headers.concat(["Vendor", "Invoice Number"]);
      } else if (moduleType === "sales") {
        headers = headers.concat(["Customer", "Invoice Number"]);
      } else if (moduleType === "expense") {
        headers = headers.concat(["Category", "Payment Method"]);
      }
      
      // Create sample rows based on module type
      const templateData: any[][] = [headers];
      
      if (moduleType === "purchase") {
        templateData.push(["PO001", "2025-01-15", 12500, "Raw materials purchase", "ABC Suppliers", "INV-2025-001"]);
        templateData.push(["PO002", "2025-01-20", 8750, "Office supplies", "XYZ Retailers", "INV-2025-056"]);
      } else if (moduleType === "sales") {
        templateData.push(["SI001", "2025-01-10", 15000, "Product sales - January", "Client A", "SI-2025-001"]);
        templateData.push(["SI002", "2025-01-25", 22500, "Service contract", "Client B", "SI-2025-002"]);
      } else if (moduleType === "expense") {
        templateData.push(["EXP001", "2025-01-05", 5000, "Travel expenses", "Travel", "Credit Card"]);
        templateData.push(["EXP002", "2025-01-12", 3500, "Office rent", "Rent", "Bank Transfer"]);
      }
      
      // Create a worksheet
      const ws = XLSX.utils.aoa_to_sheet(templateData);
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      
      // Generate Excel file
      XLSX.writeFile(wb, `${moduleType}_template.xlsx`);
      
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template");
    }
  };

  // Handlers for drag and drop
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
        <div className="space-y-6 mt-6">
          <div className="flex items-center space-x-2">
            <FileText size={20} />
            <span className="font-medium">{file.name}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Render common fields */}
            <div>
              <Label htmlFor="id-field">Transaction ID Column</Label>
              <select
                id="id-field"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={columnMapping.id}
                onChange={(e) => setColumnMapping({...columnMapping, id: e.target.value})}
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
              <Label htmlFor="date-field">Date Column</Label>
              <select
                id="date-field"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={columnMapping.date}
                onChange={(e) => setColumnMapping({...columnMapping, date: e.target.value})}
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
              <Label htmlFor="amount-field">Amount Column</Label>
              <select
                id="amount-field"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={columnMapping.amount}
                onChange={(e) => setColumnMapping({...columnMapping, amount: e.target.value})}
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
              <Label htmlFor="description-field">Description Column</Label>
              <select
                id="description-field"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={columnMapping.description}
                onChange={(e) => setColumnMapping({...columnMapping, description: e.target.value})}
              >
                <option value="">Select column</option>
                {headers.map((header, index) => (
                  <option key={index} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Render module-specific fields */}
            {moduleType === "purchase" && (
              <>
                <div>
                  <Label htmlFor="vendor-field">Vendor Column</Label>
                  <select
                    id="vendor-field"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={columnMapping.vendor || ""}
                    onChange={(e) => setColumnMapping({...columnMapping, vendor: e.target.value})}
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
                  <Label htmlFor="invoice-field">Invoice Number Column</Label>
                  <select
                    id="invoice-field"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={columnMapping.invoiceNumber || ""}
                    onChange={(e) => setColumnMapping({...columnMapping, invoiceNumber: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {moduleType === "sales" && (
              <>
                <div>
                  <Label htmlFor="customer-field">Customer Column</Label>
                  <select
                    id="customer-field"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={columnMapping.customer || ""}
                    onChange={(e) => setColumnMapping({...columnMapping, customer: e.target.value})}
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
                  <Label htmlFor="invoice-field">Invoice Number Column</Label>
                  <select
                    id="invoice-field"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={columnMapping.invoiceNumber || ""}
                    onChange={(e) => setColumnMapping({...columnMapping, invoiceNumber: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {moduleType === "expense" && (
              <>
                <div>
                  <Label htmlFor="category-field">Category Column</Label>
                  <select
                    id="category-field"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={columnMapping.category || ""}
                    onChange={(e) => setColumnMapping({...columnMapping, category: e.target.value})}
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
                  <Label htmlFor="payment-field">Payment Method Column</Label>
                  <select
                    id="payment-field"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={columnMapping.paymentMethod || ""}
                    onChange={(e) => setColumnMapping({...columnMapping, paymentMethod: e.target.value})}
                  >
                    <option value="">Select column</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
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
              disabled={isLoading || !file || !columnMapping.id || !columnMapping.date || !columnMapping.amount}
            >
              {isLoading ? "Processing..." : "Process Data"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
