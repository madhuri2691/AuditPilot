
import { useState } from "react";
import { Bill } from "./BillModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface PaymentReminderFormProps {
  bill: Bill;
  onSend: (emailContent: string, ccEmails?: string) => void;
  onCancel: () => void;
}

export function PaymentReminderForm({ bill, onSend, onCancel }: PaymentReminderFormProps) {
  // Gmail integration using mailto link for demonstration
  // In a real app, this would use a proper API integration
  
  const defaultEmailSubject = `Payment Reminder: Invoice ${bill.invoiceNumber}`;
  const defaultEmailBody = `Dear ${bill.clientName},

This is a friendly reminder that invoice ${bill.invoiceNumber} for ${bill.amount} issued on ${bill.invoiceDate} is ${bill.status === "overdue" ? "now overdue" : "due for payment"}.

Invoice details:
- Invoice Number: ${bill.invoiceNumber}
- Amount: ${bill.amount}
- Due Date: ${bill.dueDate}
- Description: ${bill.description}

Please arrange for payment at your earliest convenience.

Best regards,
Muralidhar & Associates`;

  const [emailBody, setEmailBody] = useState(defaultEmailBody);
  const [ccEmails, setCcEmails] = useState("");
  const [emailSubject, setEmailSubject] = useState(defaultEmailSubject);
  
  const handleSend = () => {
    onSend(emailBody, ccEmails);
    
    // For demonstration, we'll also open a mailto link
    // In a real application, this would be sent via an API
    const mailtoLink = `mailto:${bill.clientEmail}?subject=${encodeURIComponent(emailSubject)}&cc=${encodeURIComponent(ccEmails)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">To:</span>
            <span className="ml-2">{bill.clientEmail}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Invoice:</span>
            <span className="ml-2">{bill.invoiceNumber}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cc">CC (Optional)</Label>
          <Input
            id="cc"
            placeholder="email@example.com, another@example.com"
            value={ccEmails}
            onChange={(e) => setCcEmails(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={10}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSend}>Send Reminder</Button>
      </div>
    </div>
  );
}
