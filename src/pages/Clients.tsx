
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Download, Upload } from "lucide-react";
import { ClientsList, Client } from "@/components/clients/ClientsList";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { ImportClientsExcel } from "@/components/clients/ImportClientsExcel";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState("manual");

  const handleAddClient = (data: any) => {
    const newClient = {
      id: crypto.randomUUID(),
      ...data,
    };
    
    setClients((prev) => [...prev, newClient]);
    toast.success("Client added successfully");
    setAddDialogOpen(false);
  };
  
  const handleImportClients = (importedClients: Partial<Client>[]) => {
    setClients((prev) => [...prev, ...importedClients as Client[]]);
    setImportDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Clients</h1>
          <div className="flex gap-2">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <AddClientForm 
                  onSubmit={handleAddClient} 
                  onCancel={() => setAddDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Import Clients</DialogTitle>
                </DialogHeader>
                <ImportClientsExcel 
                  onImportSuccess={handleImportClients}
                  onCancel={() => setImportDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Client List</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
            <ClientsList />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Clients;
