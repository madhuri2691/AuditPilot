
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Mail, CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillsList } from "@/components/billing/BillsList";
import { Bill } from "@/components/billing/BillModel";
import { PaymentReminderForm } from "@/components/billing/PaymentReminderForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Sample bill data
const sampleBills: Bill[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "ABC Corporation",
    clientEmail: "accounts@abccorp.com",
    amount: "₹250,000",
    invoiceNumber: "INV-2025-001",
    invoiceDate: "2025-04-01",
    dueDate: "2025-05-01",
    status: "pending",
    reminderSent: false,
    description: "Annual financial statement audit",
    taskId: "1",
    taskName: "Financial Statement Analysis"
  },
  {
    id: "2",
    clientId: "2",
    clientName: "XYZ Industries",
    clientEmail: "finance@xyzind.com",
    amount: "₹180,000",
    invoiceNumber: "INV-2025-002",
    invoiceDate: "2025-03-15",
    dueDate: "2025-04-15",
    status: "overdue",
    reminderSent: true,
    lastReminderDate: "2025-04-20",
    description: "Tax compliance review",
    taskId: "2",
    taskName: "Tax Compliance Review"
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Acme Ltd",
    clientEmail: "ar@acme.com",
    amount: "₹150,000",
    invoiceNumber: "INV-2025-003",
    invoiceDate: "2025-03-01",
    dueDate: "2025-04-01",
    status: "paid",
    reminderSent: false,
    description: "Quarterly financial review",
    taskId: "5",
    taskName: "Quarterly Financial Review"
  },
];

const BillTracking = () => {
  const [bills, setBills] = useState<Bill[]>(sampleBills);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Filter bills based on search query and active tab
  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bill.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && bill.status === "pending";
    if (activeTab === "overdue") return matchesSearch && bill.status === "overdue";
    if (activeTab === "paid") return matchesSearch && bill.status === "paid";
    
    return matchesSearch;
  });

  // Handle marking a bill as paid
  const handleMarkAsPaid = (billId: string) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: "paid" as const } 
        : bill
    ));
    toast.success("Invoice marked as paid");
  };

  // Handle sending payment reminder
  const handleOpenReminderDialog = (bill: Bill) => {
    setSelectedBill(bill);
    setReminderDialogOpen(true);
  };

  const handleSendReminder = (emailContent: string, ccEmails?: string) => {
    if (!selectedBill) return;

    // In a real application, this would send the email via an API
    console.log("Sending reminder email to:", selectedBill.clientEmail);
    console.log("Email content:", emailContent);
    if (ccEmails) console.log("CC:", ccEmails);

    // Update the bill with reminder information
    setBills(bills.map(bill => 
      bill.id === selectedBill.id 
        ? { 
            ...bill, 
            reminderSent: true, 
            lastReminderDate: new Date().toISOString().split('T')[0] 
          } 
        : bill
    ));

    setReminderDialogOpen(false);
    toast.success(`Payment reminder sent to ${selectedBill.clientName}`);
  };

  // Statistics
  const totalPending = bills.filter(bill => bill.status === "pending").length;
  const totalOverdue = bills.filter(bill => bill.status === "overdue").length;
  const totalPaid = bills.filter(bill => bill.status === "paid").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Bill Tracking</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">{totalPending}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold">{totalOverdue}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{totalPaid}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill List */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All Invoices ({bills.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({totalPending})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  Overdue ({totalOverdue})
                </TabsTrigger>
                <TabsTrigger value="paid">
                  Paid ({totalPaid})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <BillsList 
                  bills={filteredBills} 
                  onMarkAsPaid={handleMarkAsPaid}
                  onSendReminder={handleOpenReminderDialog}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Payment Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <PaymentReminderForm
              bill={selectedBill}
              onSend={handleSendReminder}
              onCancel={() => setReminderDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default BillTracking;
