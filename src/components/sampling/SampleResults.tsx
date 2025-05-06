import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface SampleConfig {
  type: string;
  count: number;
  // Add other configuration properties as needed
}

interface Sample {
  id: string;
  date: string;
  amount: number;
  entity: string;
  description: string;
}

interface SampleResultsProps {
  sampleConfig: SampleConfig;
  samples: Sample[];
}

const SampleResults: React.FC<SampleResultsProps> = ({ sampleConfig, samples }) => {

  const handleCopyToClipboard = () => {
    try {
      const sampleText = samples.map(sample =>
        `${sample.id}\t${sample.date}\t${sample.amount}\t${sample.entity}\t${sample.description}`
      ).join('\n');

      navigator.clipboard.writeText(sampleText);

      toast({
        title: "Copied to Clipboard",
        description: "Sample data copied to clipboard.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy sample data to clipboard.",
      });
    }
  };

  const handleDownloadExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Prepare data for samples worksheet
      const headers = [
        "ID", "Date", "Amount", "Vendor/Customer", "Description", "Test Result", "Notes"
      ];
      
      const samplesData = samples.map((sample, index) => [
        sample.id,
        sample.date,
        sample.amount,
        sample.entity,
        sample.description,
        "", // Empty column for test result
        ""  // Empty column for notes
      ]);
      
      // Create the samples worksheet
      const samplesWs = XLSX.utils.aoa_to_sheet([headers, ...samplesData]);
      
      // Set column widths - Fixed: converting string widths to numbers
      samplesWs['!cols'] = [
        { wch: 15 }, // ID
        { wch: 12 }, // Date
        { wch: 12 }, // Amount
        { wch: 20 }, // Vendor/Customer
        { wch: 30 }, // Description
        { wch: 15 }, // Test Result
        { wch: 20 }  // Notes
      ];
      
      // Add the samples worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, samplesWs, "Samples");
      
      // Prepare testing template worksheet
      const templateHeaders = [
        "#", "ID", "Test Procedure", "Result", "Explanation", "Workpaper Ref"
      ];
      
      const testProcedures = [
        "Verify document date",
        "Verify amount matches voucher",
        "Verify proper approvals",
        "Verify accounting classification",
        "Verify compliance with policy"
      ];
      
      const templateData = testProcedures.map((proc, i) => [
        i + 1, // Fixed: converting string to number for proper numbering
        "", // ID to be filled by user
        proc,
        "", // Result to be filled
        "", // Explanation to be filled
        ""  // Workpaper ref to be filled
      ]);
      
      const templateWs = XLSX.utils.aoa_to_sheet([templateHeaders, ...templateData]);
      
      // Set column widths - Fixed: converting string widths to numbers
      templateWs['!cols'] = [
        { wch: 5 },  // #
        { wch: 15 }, // ID
        { wch: 30 }, // Test Procedure
        { wch: 15 }, // Result
        { wch: 30 }, // Explanation
        { wch: 15 }  // Workpaper Ref
      ];
      
      // Add the template worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, templateWs, "Testing Template");
      
      // Save the workbook to a file
      XLSX.writeFile(wb, `${sampleConfig.type}_samples_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Samples and testing template downloaded as Excel file.",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting the samples. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Results</CardTitle>
        <CardDescription>
          Review the generated samples for {sampleConfig.type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {samples.length === 0 ? (
          <div className="text-center py-4">No samples generated.</div>
        ) : (
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Vendor/Customer</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>{sample.date}</TableCell>
                    <TableCell>{sample.amount}</TableCell>
                    <TableCell>{sample.entity}</TableCell>
                    <TableCell>{sample.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
      <div className="flex justify-between p-4">
        <Badge variant="secondary">
          Total Samples: {samples.length}
        </Badge>
        <div>
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button size="sm" className="ml-2" onClick={handleDownloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SampleResults;
