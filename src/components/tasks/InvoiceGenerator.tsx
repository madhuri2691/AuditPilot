
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { DEFAULT_INVOICE_DETAILS, InvoiceDetails, Task } from "./TaskModel";
import { FileText } from "lucide-react";

interface InvoiceGeneratorProps {
  task: Task;
}

export function InvoiceGenerator({ task }: InvoiceGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<InvoiceDetails>({
    defaultValues: DEFAULT_INVOICE_DETAILS,
  });

  const handleSubmit = (data: InvoiceDetails) => {
    generateInvoicePDF(task, data);
    setIsOpen(false);
  };

  const generateInvoicePDF = (task: Task, invoiceDetails: InvoiceDetails) => {
    // This is a placeholder for actual PDF generation
    // In a real app, you might use a library like jsPDF or a backend service
    
    const invoiceDate = new Date().toLocaleDateString();
    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
    
    // Create a printable div
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to generate invoice');
      return;
    }
    
    // Format amount with commas for thousands
    const formatAmount = (amount: number): string => {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Calculate taxes
    const amount = 1000; // Placeholder amount, would come from task data
    const taxRate = 0.18; // 18% GST (9% CGST + 9% SGST or 18% IGST)
    const taxAmount = amount * taxRate;
    const totalAmount = amount + taxAmount;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .amount-table { width: 350px; margin-left: auto; margin-top: 30px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="invoice-title">${invoiceDetails.firmName}</div>
              <div>${invoiceDetails.address}</div>
              <div>GSTIN: ${invoiceDetails.gstin}</div>
            </div>
            <div>
              <div><strong>Invoice Number:</strong> ${invoiceNumber}</div>
              <div><strong>Date:</strong> ${invoiceDate}</div>
            </div>
          </div>
          
          <div>
            <div><strong>Client:</strong> ${task.client}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>SAC Code</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${task.description || task.name}</td>
                <td>${task.sacCode || 'N/A'}</td>
                <td>₹${formatAmount(amount)}</td>
              </tr>
            </tbody>
          </table>
          
          <table class="amount-table">
            <tr>
              <td>Subtotal:</td>
              <td>₹${formatAmount(amount)}</td>
            </tr>
    `);
    
    // Add tax lines based on IGST or CGST+SGST selection
    if (invoiceDetails.isIGST) {
      printWindow.document.write(`
        <tr>
          <td>IGST (18%):</td>
          <td>₹${formatAmount(taxAmount)}</td>
        </tr>
      `);
    } else {
      const singleTaxAmount = taxAmount / 2;
      printWindow.document.write(`
        <tr>
          <td>CGST (9%):</td>
          <td>₹${formatAmount(singleTaxAmount)}</td>
        </tr>
        <tr>
          <td>SGST (9%):</td>
          <td>₹${formatAmount(singleTaxAmount)}</td>
        </tr>
      `);
    }
    
    printWindow.document.write(`
            <tr>
              <td><strong>Total:</strong></td>
              <td><strong>₹${formatAmount(totalAmount)}</strong></td>
            </tr>
          </table>
          
          <div class="footer">
            <p>Payment terms: Due on receipt</p>
            <p>Thank you for your business!</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gstin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isIGST"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Use IGST
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Toggle for IGST (18%) or CGST+SGST (9%+9%)
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
