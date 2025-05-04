
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, AlertTriangle, Clock } from "lucide-react";
import { Bill } from "./BillModel";

interface BillsListProps {
  bills: Bill[];
  onMarkAsPaid: (billId: string) => void;
  onSendReminder: (bill: Bill) => void;
}

export function BillsList({ bills, onMarkAsPaid, onSendReminder }: BillsListProps) {
  // Helper function to determine status badge
  const getStatusBadge = (status: Bill['status']) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock size={12} /> Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle size={12} /> Overdue</Badge>;
      case "paid":
        return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle size={12} /> Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate days overdue
  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.invoiceNumber}</TableCell>
                <TableCell>{bill.clientName}</TableCell>
                <TableCell>{bill.amount}</TableCell>
                <TableCell>{bill.invoiceDate}</TableCell>
                <TableCell>
                  <div>
                    {bill.dueDate}
                    {bill.status === "overdue" && (
                      <div className="text-xs text-red-500 font-medium">
                        {calculateDaysOverdue(bill.dueDate)} days overdue
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(bill.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {bill.status !== "paid" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onMarkAsPaid(bill.id)} 
                          className="h-8 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Mark Paid
                        </Button>
                        <Button 
                          variant={bill.status === "overdue" ? "destructive" : "secondary"} 
                          size="sm" 
                          onClick={() => onSendReminder(bill)} 
                          className="h-8 flex items-center gap-1"
                        >
                          <Mail size={14} />
                          Send Reminder
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
