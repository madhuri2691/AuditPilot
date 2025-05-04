
export interface Bill {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  amount: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  reminderSent: boolean;
  lastReminderDate?: string;
  description: string;
  taskId?: string;
  taskName?: string;
}
