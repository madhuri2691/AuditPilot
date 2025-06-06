
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
  constitution?: string;
  auditFee?: string;
  engagementType?: string;
  auditStartDate?: string;
  auditCompletionDate?: string;
  assignmentStaff?: string;
  auditPartner?: string;
}

// Helper function to format date strings to ISO format
const formatDateForDB = (dateStr: string | undefined): string | null => {
  if (!dateStr) return null;
  // The date should already be in YYYY-MM-DD format from the datepicker
  return dateStr;
};

export const getClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
      throw error;
    }
    
    // Map database column names to client interface
    const mappedClients = data?.map(client => ({
      id: client.id,
      name: client.name,
      industry: client.industry,
      status: client.status,
      risk: client.risk_level, // Map from risk_level to risk
      fiscalYearEnd: client.fiscal_year_end,
      contactPerson: client.contact_person,
      contactRole: client.contact_role,
      email: client.email,
      phone: client.phone,
      address: client.address,
      entity_type: client.entity_type,
      priority: client.priority,
      constitution: client.constitution,
      auditFee: client.audit_fee,
      engagementType: client.engagement_type,
      auditStartDate: client.audit_start_date,
      auditCompletionDate: client.audit_completion_date,
      assignmentStaff: client.assignment_staff,
      auditPartner: client.audit_partner
    })) || [];
    
    return mappedClients;
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    toast.error('Failed to load clients');
    return [];
  }
};

export const addClient = async (client: Client) => {
  try {
    // Make sure required fields are present
    if (!client.name) {
      toast.error('Client name is required');
      throw new Error('Client name is required');
    }

    // Ensure risk_level is always one of the accepted values: 'High', 'Medium', or 'Low'
    // Based on the database check constraint
    const validRiskLevels = ['High', 'Medium', 'Low'];
    const riskLevel = client.risk && validRiskLevels.includes(client.risk) 
      ? client.risk 
      : 'Medium'; // Default to 'Medium' if empty or invalid
    
    console.log('Processing risk level:', client.risk, '→', riskLevel);

    // Map client properties to match the database column names and format dates
    const mappedClient = {
      name: client.name,
      industry: client.industry,
      status: client.status,
      risk_level: riskLevel,
      fiscal_year_end: formatDateForDB(client.fiscalYearEnd),
      contact_person: client.contactPerson,
      contact_role: client.contactRole,
      email: client.email,
      phone: client.phone,
      address: client.address,
      entity_type: client.entity_type,
      priority: client.priority,
      constitution: client.constitution,
      audit_fee: client.auditFee,
      engagement_type: client.engagementType,
      audit_start_date: formatDateForDB(client.auditStartDate),
      audit_completion_date: formatDateForDB(client.auditCompletionDate),
      assignment_staff: client.assignmentStaff,
      audit_partner: client.auditPartner
    };
    
    console.log('Adding client with data:', mappedClient);
    
    const { data, error } = await supabase
      .from('clients')
      .insert([mappedClient])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error adding client:', error);
      toast.error(`Failed to add client: ${error.message}`);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned when adding client');
      toast.error('Failed to add client: No data returned');
      throw new Error('No data returned when adding client');
    }
    
    // Map the returned data back to our Client interface
    const newClient: Client = {
      id: data.id,
      name: data.name,
      industry: data.industry,
      status: data.status,
      risk: data.risk_level, // Map from risk_level to risk
      fiscalYearEnd: data.fiscal_year_end,
      contactPerson: data.contact_person,
      contactRole: data.contact_role,
      email: data.email,
      phone: data.phone,
      address: data.address,
      entity_type: data.entity_type,
      priority: data.priority,
      constitution: data.constitution,
      auditFee: data.audit_fee,
      engagementType: data.engagement_type,
      auditStartDate: data.audit_start_date,
      auditCompletionDate: data.audit_completion_date,
      assignmentStaff: data.assignment_staff,
      auditPartner: data.audit_partner
    };
    
    console.log('Client added successfully:', newClient);
    toast.success('Client added successfully');
    return newClient;
  } catch (error: any) {
    console.error('Error adding client:', error);
    toast.error(`Failed to add client: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

export const updateClient = async (id: string, client: Partial<Client>) => {
  try {
    // Ensure risk_level is valid if provided
    const validRiskLevels = ['High', 'Medium', 'Low'];
    let riskLevel = client.risk;
    if (client.risk && !validRiskLevels.includes(client.risk)) {
      riskLevel = 'Medium'; // Default to 'Medium' if invalid
    }

    // Map client properties to match the database column names
    const mappedClient: any = {};
    
    if (client.name) mappedClient.name = client.name;
    if (client.industry) mappedClient.industry = client.industry;
    if (client.status) mappedClient.status = client.status;
    if (riskLevel) mappedClient.risk_level = riskLevel;
    if (client.fiscalYearEnd) mappedClient.fiscal_year_end = formatDateForDB(client.fiscalYearEnd);
    if (client.contactPerson) mappedClient.contact_person = client.contactPerson;
    if (client.contactRole) mappedClient.contact_role = client.contactRole;
    if (client.email) mappedClient.email = client.email;
    if (client.phone) mappedClient.phone = client.phone;
    if (client.address) mappedClient.address = client.address;
    if (client.entity_type) mappedClient.entity_type = client.entity_type;
    if (client.priority) mappedClient.priority = client.priority;
    if (client.constitution) mappedClient.constitution = client.constitution;
    if (client.auditFee) mappedClient.audit_fee = client.auditFee;
    if (client.engagementType) mappedClient.engagement_type = client.engagementType;
    if (client.auditStartDate) mappedClient.audit_start_date = formatDateForDB(client.auditStartDate);
    if (client.auditCompletionDate) mappedClient.audit_completion_date = formatDateForDB(client.auditCompletionDate);
    if (client.assignmentStaff) mappedClient.assignment_staff = client.assignmentStaff;
    if (client.auditPartner) mappedClient.audit_partner = client.auditPartner;
    
    const { data, error } = await supabase
      .from('clients')
      .update(mappedClient)
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
