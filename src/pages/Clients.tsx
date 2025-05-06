
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Upload } from "lucide-react";
import { ClientsList } from "@/components/clients/ClientsListWrapper";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { ImportClientsExcel } from "@/components/clients/ImportClientsExcel";
import { ExportClients } from "@/components/clients/ExportClients";
import { toast } from "sonner";
import { getClients, addClient, Client } from "@/services/clientService";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch clients on component mount
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const handleAddClient = async (data: any) => {
    try {
      const newClient = await addClient(data);
      setClients((prev) => [newClient, ...prev]);
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };
  
  const handleImportClients = async (importedClients: Partial<Client>[]) => {
    try {
      const promises = importedClients.map(client => addClient(client as Client));
      const results = await Promise.allSettled(promises);
      
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      toast.success(`Successfully imported ${successCount} of ${importedClients.length} clients`);
      
      // Refresh client list
      fetchClients();
      
      setImportDialogOpen(false);
    } catch (error) {
      console.error("Error importing clients:", error);
      toast.error("Failed to import clients");
    }
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
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
            
            <ExportClients clients={clients} />
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
            <ClientsList 
              clients={clients} 
              isLoading={isLoading} 
              searchTerm={searchTerm}
              onRefreshClients={fetchClients}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Clients;
