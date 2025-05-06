
import { useState, useEffect } from 'react';
import { ClientsList as ReadOnlyClientsList, Client } from './ClientsList';
import { deleteClient } from '@/services/clientService';
import { toast } from 'sonner';

interface ClientsListWrapperProps {
  clients: Client[];
  isLoading: boolean;
  searchTerm: string;
  onRefreshClients?: () => void;
}

export const ClientsList = ({ 
  clients,
  isLoading,
  searchTerm,
  onRefreshClients
}: ClientsListWrapperProps) => {
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  
  // Filter clients based on search term
  useEffect(() => {
    if (!clients) return;
    
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.industry && client.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredClients(filtered);
  }, [clients, searchTerm]);
  
  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      
      // Remove client from local state
      setFilteredClients(prev => prev.filter(client => client.id !== clientId));
      
      // Refresh the full list if callback provided
      if (onRefreshClients) {
        onRefreshClients();
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading clients...</div>;
  }
  
  if (filteredClients.length === 0) {
    return <div className="text-center py-4">No clients found</div>;
  }
  
  return (
    <ReadOnlyClientsList 
      clients={filteredClients}
      onDelete={handleDeleteClient}
    />
  );
};
