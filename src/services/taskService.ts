
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id?: string;
  name: string;
  client_id?: string;
  client?: string;
  assignee_id?: string;
  assignee?: string;
  status: 'Not Started' | 'In Progress' | 'Review' | 'Complete';
  progress?: number;
  deadline?: string;
  typeOfService?: string;
  type_of_service?: string;
  description?: string;
  sac_code?: string;
}

export const getTasks = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        clients(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match the expected Task interface
    const transformedData = data.map(item => ({
      id: item.id,
      name: item.name,
      client_id: item.client_id,
      client: item.clients ? item.clients.name : '',
      assignee_id: item.assignee_id,
      status: item.status,
      progress: item.progress,
      deadline: item.deadline,
      type_of_service: item.type_of_service,
      description: item.description,
      sac_code: item.sac_code
    }));
    
    return transformedData || [];
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    toast.error('Failed to load tasks');
    return [];
  }
};

export const addTask = async (task: Task) => {
  try {
    // Format the task object to match the database schema
    const formattedTask = {
      name: task.name,
      client_id: task.client_id,
      assignee_id: task.assignee_id,
      status: task.status,
      progress: task.progress,
      deadline: task.deadline,
      type_of_service: task.typeOfService || task.type_of_service,
      description: task.description,
      sac_code: task.sac_code
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([formattedTask])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Task added successfully');
    return data;
  } catch (error: any) {
    console.error('Error adding task:', error);
    toast.error('Failed to add task');
    throw error;
  }
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  try {
    // Format the task object to match the database schema
    const formattedTask: any = {};
    if (task.name) formattedTask.name = task.name;
    if (task.client_id) formattedTask.client_id = task.client_id;
    if (task.assignee_id) formattedTask.assignee_id = task.assignee_id;
    if (task.status) formattedTask.status = task.status;
    if (task.progress !== undefined) formattedTask.progress = task.progress;
    if (task.deadline) formattedTask.deadline = task.deadline;
    if (task.typeOfService || task.type_of_service) 
      formattedTask.type_of_service = task.typeOfService || task.type_of_service;
    if (task.description) formattedTask.description = task.description;
    if (task.sac_code) formattedTask.sac_code = task.sac_code;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(formattedTask)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Task updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error updating task:', error);
    toast.error('Failed to update task');
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Task deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting task:', error);
    toast.error('Failed to delete task');
    throw error;
  }
};
