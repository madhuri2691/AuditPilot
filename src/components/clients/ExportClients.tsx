
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { Client } from './ClientsList';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportClientsProps {
  clients: Client[];
}

export function ExportClients({ clients }: ExportClientsProps) {
  const handleExport = () => {
    try {
      if (!clients || clients.length === 0) {
        toast.error("No clients to export");
        return;
      }

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Format the data for export
      const formattedData = clients.map(client => {
        return {
          "Name": client.name,
          "Industry": client.industry,
          "Status": client.status,
          "Risk Level": client.risk,
          "Fiscal Year End": client.fiscalYearEnd,
          "Contact Person": client.contactPerson,
          "Email": client.email || "",
          "Phone": client.phone || "",
          "Address": client.address || "",
          "Constitution": client.constitution || "",
          "Audit Fee": client.auditFee || "",
          "Engagement Type": client.engagementType || "",
          "Audit Start Date": client.auditStartDate || "",
          "Audit Completion Date": client.auditCompletionDate || "",
          "Assignment Staff": client.assignmentStaff || "",
          "Audit Partner": client.auditPartner || ""
        };
      });
      
      // Create the worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 15 }, // Industry
        { wch: 12 }, // Status
        { wch: 12 }, // Risk
        { wch: 15 }, // Fiscal Year End
        { wch: 20 }, // Contact Person
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 30 }, // Address
        { wch: 15 }, // Constitution
        { wch: 12 }, // Audit Fee
        { wch: 18 }, // Engagement Type
        { wch: 15 }, // Start Date
        { wch: 15 }, // Completion Date
        { wch: 20 }, // Staff
        { wch: 20 }  // Partner
      ];
      
      worksheet['!cols'] = colWidths;
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
      
      // Generate the Excel file
      XLSX.writeFile(workbook, `clients-${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success("Clients exported successfully");
    } catch (error) {
      console.error("Error exporting clients:", error);
      toast.error("Failed to export clients");
    }
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" /> Export
    </Button>
  );
}
