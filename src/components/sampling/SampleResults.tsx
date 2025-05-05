
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { TransactionItem, SamplingModuleType } from "./SamplingTool";

interface SampleResultsProps {
  samples: TransactionItem[];
  totalTransactions: number;
  totalValue: number;
  moduleType: SamplingModuleType;
  onResetConfig: () => void;
  onFullReset: () => void;
}

export function SampleResults({ 
  samples, 
  totalTransactions, 
  totalValue, 
  moduleType, 
  onResetConfig, 
  onFullReset 
}: SampleResultsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter samples based on search term
  const filteredSamples = samples.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.customer && item.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Calculate coverage statistics
  const samplesValue = samples.reduce((sum, item) => sum + item.amount, 0);
  const coveragePercentage = (samples.length / totalTransactions) * 100;
  const valueCoveragePercentage = (samplesValue / totalValue) * 100;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Download samples as Excel
  const downloadExcel = () => {
    try {
      // Format the data for export
      const workbook = XLSX.utils.book_new();
      
      // Create sample summary sheet
      const summaryData = [
        ['Sampling Summary'],
        [''],
        ['Sample Type', moduleType.charAt(0).toUpperCase() + moduleType.slice(1) + ' Sampling'],
        ['Date Generated', new Date().toLocaleDateString()],
        [''],
        ['Population Size', totalTransactions.toString()],
        ['Sample Size', samples.length.toString()],
        ['Coverage %', `${coveragePercentage.toFixed(2)}%`],
        [''],
        ['Population Value', formatCurrency(totalValue)],
        ['Sampled Value', formatCurrency(samplesValue)],
        ['Value Coverage %', `${valueCoveragePercentage.toFixed(2)}%`]
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');
      
      // Create the selected samples sheet
      const headers = ['Transaction ID', 'Date', 'Amount', 'Description'];
      
      // Add module-specific headers
      if (moduleType === 'purchase') {
        headers.push('Vendor', 'Invoice Number');
      } else if (moduleType === 'sales') {
        headers.push('Customer', 'Invoice Number');
      } else if (moduleType === 'expense') {
        headers.push('Category', 'Payment Method');
      }
      
      // Add testing columns
      headers.push(
        'Vouching Ref', 
        'Test Result', 
        'Findings', 
        'Prepared By', 
        'Date'
      );
      
      // Create the samples data
      const samplesData = samples.map(item => {
        const row: any[] = [
          item.id,
          item.date,
          item.amount,
          item.description
        ];
        
        // Add module-specific data
        if (moduleType === 'purchase') {
          row.push(item.vendor || '', item.invoiceNumber || '');
        } else if (moduleType === 'sales') {
          row.push(item.customer || '', item.invoiceNumber || '');
        } else if (moduleType === 'expense') {
          row.push(item.category || '', item.paymentMethod || '');
        }
        
        // Add empty cells for testing columns
        row.push('', '', '', '', '');
        
        return row;
      });
      
      // Create the samples worksheet
      const samplesWs = XLSX.utils.aoa_to_sheet([headers, ...samplesData]);
      
      // Set column widths - Fixed: converting string widths to numbers
      samplesWs['!cols'] = [
        { wch: 15 }, // ID
        { wch: 12 }, // Date
        { wch: 12 }, // Amount
        { wch: 40 }, // Description
        { wch: 25 }, // Vendor/Customer/Category
        { wch: 15 }, // Invoice/Payment Method
        { wch: 15 }, // Vouching Ref
        { wch: 12 }, // Test Result
        { wch: 30 }, // Findings
        { wch: 15 }, // Prepared By
        { wch: 12 }, // Date
      ];
      
      XLSX.utils.book_append_sheet(workbook, samplesWs, 'Selected Samples');
      
      // Create the testing template
      const templateHeaders = ['#', ...headers];
      const templateData = samples.map((item, index) => {
        const row = [index + 1];
        
        // Add item data
        row.push(
          item.id,
          item.date,
          item.amount,
          item.description
        );
        
        // Add module-specific data
        if (moduleType === 'purchase') {
          row.push(item.vendor || '', item.invoiceNumber || '');
        } else if (moduleType === 'sales') {
          row.push(item.customer || '', item.invoiceNumber || '');
        } else if (moduleType === 'expense') {
          row.push(item.category || '', item.paymentMethod || '');
        }
        
        // Add empty cells for testing columns
        row.push('', '', '', '', '');
        
        return row;
      });
      
      const templateWs = XLSX.utils.aoa_to_sheet([templateHeaders, ...templateData]);
      
      // Set column widths - Fixed: converting string widths to numbers
      templateWs['!cols'] = [
        { wch: 5 },  // #
        { wch: 15 }, // ID
        { wch: 12 }, // Date
        { wch: 12 }, // Amount
        { wch: 40 }, // Description
        { wch: 25 }, // Vendor/Customer/Category
        { wch: 15 }, // Invoice/Payment Method
        { wch: 15 }, // Vouching Ref
        { wch: 12 }, // Test Result
        { wch: 30 }, // Findings
        { wch: 15 }, // Prepared By
        { wch: 12 }, // Date
      ];
      
      XLSX.utils.book_append_sheet(workbook, templateWs, 'Testing Worksheet');
      
      // Generate Excel file
      const fileName = `${moduleType}_sampling_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success("Excel workpaper downloaded successfully");
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast.error("Failed to generate Excel workpaper");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sampling Results</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResetConfig}>
            Adjust Parameters
          </Button>
          <Button variant="outline" onClick={onFullReset}>
            Start Over
          </Button>
        </div>
      </div>
      
      {/* Sample statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm text-muted-foreground">Sample Size</p>
          <p className="text-xl font-bold">{samples.length} of {totalTransactions}</p>
          <p className="text-xs text-muted-foreground">{coveragePercentage.toFixed(2)}% Coverage</p>
        </div>
        
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm text-muted-foreground">Sample Value</p>
          <p className="text-xl font-bold truncate">{formatCurrency(samplesValue)}</p>
          <p className="text-xs text-muted-foreground">{valueCoveragePercentage.toFixed(2)}% of Total</p>
        </div>
        
        <div className="bg-muted p-3 rounded-md md:col-span-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Download Options</p>
            <Button size="sm" onClick={downloadExcel} className="gap-2">
              <FileText size={16} />
              Download Control Sheet
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sample results table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input 
            placeholder={`Search ${moduleType} samples...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Badge variant="outline" className="text-xs">
            {filteredSamples.length} of {samples.length} samples
          </Badge>
        </div>
        
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                
                {moduleType === 'purchase' && (
                  <>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Invoice#</TableHead>
                  </>
                )}
                
                {moduleType === 'sales' && (
                  <>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice#</TableHead>
                  </>
                )}
                
                {moduleType === 'expense' && (
                  <>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSamples.length > 0 ? (
                filteredSamples.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    
                    {moduleType === 'purchase' && (
                      <>
                        <TableCell>{item.vendor || '-'}</TableCell>
                        <TableCell>{item.invoiceNumber || '-'}</TableCell>
                      </>
                    )}
                    
                    {moduleType === 'sales' && (
                      <>
                        <TableCell>{item.customer || '-'}</TableCell>
                        <TableCell>{item.invoiceNumber || '-'}</TableCell>
                      </>
                    )}
                    
                    {moduleType === 'expense' && (
                      <>
                        <TableCell>{item.category || '-'}</TableCell>
                        <TableCell>{item.paymentMethod || '-'}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={moduleType === 'purchase' || moduleType === 'sales' || moduleType === 'expense' ? 6 : 4} className="text-center py-6">
                    No samples match your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Download instructions */}
      <div className="bg-muted/50 p-4 rounded-md">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Control Sheet Details</h4>
            <p className="text-sm text-muted-foreground mb-2">
              The downloaded Excel workpaper includes:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>Summary of sampling parameters and coverage statistics</li>
              <li>Complete list of selected samples with all data fields</li>
              <li>Testing worksheet with columns for documenting test results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
