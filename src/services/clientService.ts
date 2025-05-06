
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id?: string;
  name: string;
  industry?: string;
  status?: string;
  risk?: string;
  fiscalYearEnd?: string;
  contactPerson?: string;
  contactRole?: string;
  email?: string;
  phone?: string;
  address?: string;
  entity_type?: string;
  priority?: string;
}

export const getClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    toast.error('Failed to load clients');
    return [];
  }
};

export const addClient = async (client: Client) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Client added successfully');
    return data;
  } catch (error: any) {
    console.error('Error adding client:', error);
    toast.error('Failed to add client');
    throw error;
  }
};

export const updateClient = async (id: string, client: Partial<Client>) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Client updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error updating client:', error);
    toast.error('Failed to update client');
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Client deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting client:', error);
    toast.error('Failed to delete client');
    throw error;
  }
};
