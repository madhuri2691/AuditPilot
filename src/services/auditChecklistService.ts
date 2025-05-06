
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChecklistItem {
  id?: string;
  checklist_id: string;
  area: string;
  procedure: string;
  responsibility?: string;
  timeline?: string;
  is_done?: boolean;
  remarks?: string;
}

export interface AuditChecklist {
  id?: string;
  task_id: string;
  type: string;
  financial_year?: string;
  assessment_year?: string;
  start_date?: string;
  items?: ChecklistItem[];
}

export const getAuditChecklists = async (taskId: string) => {
  try {
    const { data, error } = await supabase
      .from('audit_checklists')
      .select('*')
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching audit checklists:', error);
    toast.error('Failed to load audit checklists');
    return [];
  }
};

export const getChecklistItems = async (checklistId: string) => {
  try {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('checklist_id', checklistId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching checklist items:', error);
    toast.error('Failed to load checklist items');
    return [];
  }
};

export const createAuditChecklist = async (checklist: AuditChecklist) => {
  try {
    // First, create the checklist
    const { data, error } = await supabase
      .from('audit_checklists')
      .insert([{
        task_id: checklist.task_id,
        type: checklist.type,
        financial_year: checklist.financial_year,
        assessment_year: checklist.assessment_year,
        start_date: checklist.start_date
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Next, if there are items, create them
    if (checklist.items && checklist.items.length > 0 && data.id) {
      const items = checklist.items.map(item => ({
        ...item,
        checklist_id: data.id
      }));
      
      const { error: itemsError } = await supabase
        .from('checklist_items')
        .insert(items);
      
      if (itemsError) throw itemsError;
    }
    
    toast.success('Audit checklist created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating audit checklist:', error);
    toast.error('Failed to create audit checklist');
    throw error;
  }
};

export const updateChecklistItem = async (id: string, item: Partial<ChecklistItem>) => {
  try {
    const { data, error } = await supabase
      .from('checklist_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error updating checklist item:', error);
    toast.error('Failed to update checklist item');
    throw error;
  }
};
