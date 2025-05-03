
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { FilePlus, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Client } from '@/components/clients/ClientsList';

interface ImportClientsExcelProps {
  onImportSuccess: (clients: Partial<Client>[]) => void;
  onCancel: () => void;
}

export function ImportClientsExcel({ onImportSuccess, onCancel }: ImportClientsExcelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const downloadTemplate = () => {
    // Create template structure
    const template = [
      {
        'Client Name': 'Example Corp',
        'Industry': 'Technology',
        'Contact Person': 'John Smith',
        'Email': 'john@example.com',
        'Phone': '555-123-4567',
        'Address': '123 Main St, Anytown, USA',
        'Constitution': 'LLC',
        'Audit Fee': '10000',
        'Fiscal Year End': 'Dec 31',
        'Engagement Type': 'Audit',
        'Audit Start Date': '2025-01-15',
        'Audit Completion Target Date': '2025-03-15',
        'Assignment Staff': 'Jane Doe',
        'Audit Partner': 'Robert Johnson',
        'Risk Level': 'Medium',
        'Status': 'Active'
      }
    ];
    
    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Template");
    
    // Generate and download file
    XLSX.writeFile(wb, "client_import_template.xlsx");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Map the Excel columns to our client model
      const clients = jsonData.map((row: any) => ({
        id: crypto.randomUUID(),
        name: row['Client Name'] || '',
        industry: row['Industry'] || '',
        contactPerson: row['Contact Person'] || '',
        email: row['Email'] || '',
        phone: row['Phone'] || '',
        address: row['Address'] || '',
        constitution: row['Constitution'] || '',
        auditFee: row['Audit Fee'] || '',
        fiscalYearEnd: row['Fiscal Year End'] || '',
        engagementType: row['Engagement Type'] || '',
        auditStartDate: row['Audit Start Date'] || '',
        auditCompletionDate: row['Audit Completion Target Date'] || '',
        assignmentStaff: row['Assignment Staff'] || '',
        auditPartner: row['Audit Partner'] || '',
        risk: (row['Risk Level'] || 'Medium') as 'High' | 'Medium' | 'Low',
        status: (row['Status'] || 'Active') as 'Active' | 'Completed' | 'On Hold'
      }));
      
      toast.success(`Successfully imported ${clients.length} clients`);
      onImportSuccess(clients);
    } catch (error) {
      toast.error("Failed to import data. Please check your file format.");
      console.error("Import error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-medium">Import Clients from Excel</h2>
        <p className="text-sm text-muted-foreground">
          Upload a spreadsheet containing client information. 
          Make sure to use the correct format.
        </p>
        <Button variant="outline" onClick={downloadTemplate} className="w-full sm:w-auto mt-2">
          <Download className="mr-2 h-4 w-4" /> Download Template
        </Button>
      </div>
      
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: {file.name}
          </p>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={!file || isUploading}
        >
          <FilePlus className="mr-2 h-4 w-4" /> 
          {isUploading ? "Importing..." : "Import Clients"}
        </Button>
      </div>
    </div>
  );
}
