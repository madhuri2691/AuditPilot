
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task } from '@/components/tasks/TaskModel';

// Export the interface for DB tasks
export interface TaskDB {
  id?: string;
  name: string;
  client_id?: string;
  assignee_id?: string;
  status: string;
  progress?: number;
  deadline?: string;
  type_of_service?: string;
  sac_code?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // Add this to store client name separately from the join
  client?: string;
}

// Get all tasks
export const getTasks = async (): Promise<TaskDB[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, clients(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map the data to include client name from the join
    const tasksWithClientNames = data.map(task => {
      const clients = task.clients as any;
      return {
        ...task,
        client: clients?.name || '',
        clients: undefined  // Remove the nested object
      };
    });
    
    return tasksWithClientNames;
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    toast.error('Failed to load tasks');
    return [];
  }
};

// Add a new task
export const addTask = async (task: Task): Promise<TaskDB> => {
  try {
    // Convert frontend task model to DB model
    const dbTask: TaskDB = {
      name: task.name,
      client_id: task.client_id,
      assignee_id: task.assignee_id,
      status: task.status,
      progress: task.progress,
      deadline: task.deadline,
      type_of_service: task.typeOfService || task.type_of_service,
      sac_code: task.sacCode || task.sac_code,
      description: task.description
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([dbTask])
      .select()
      .single();
    
    if (error) throw error;
    
    // Get client name for the returned task
    if (data.client_id) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('name')
        .eq('id', data.client_id)
        .single();
      
      if (!clientError && clientData) {
        // Create a new object with the client property
        const taskWithClient = {
          ...data,
          client: clientData.name
        };
        
        toast.success('Task added successfully');
        return taskWithClient;
      }
    }
    
    // If no client data was found, return the task without client name
    toast.success('Task added successfully');
    return { ...data, client: '' };
  } catch (error: any) {
    console.error('Error adding task:', error);
    toast.error('Failed to add task');
    throw error;
  }
};

// Update a task
export const updateTask = async (id: string, updates: Partial<TaskDB>): Promise<TaskDB> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Get client name for the returned task
    if (data.client_id) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('name')
        .eq('id', data.client_id)
        .single();
      
      if (!clientError && clientData) {
        // Create a new object with the client property
        const taskWithClient = {
          ...data,
          client: clientData.name
        };
        
        toast.success('Task updated successfully');
        return taskWithClient;
      }
    }
    
    // If no client data was found, return the task without client name
    toast.success('Task updated successfully');
    return { ...data, client: '' };
  } catch (error: any) {
    console.error('Error updating task:', error);
    toast.error('Failed to update task');
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<boolean> => {
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
