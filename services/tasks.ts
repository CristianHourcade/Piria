import { supabase } from '@/lib/supabaseClient';
import { Task } from '@/types/task';

export async function fetchTasks(): Promise<Task[]> {
    const { data, error } = await supabase
        .from('task')
        .select('*')
        .order('due_date', { ascending: true });

    if (error) throw error;
    return data as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
        .from('task')
        .insert([task])
        .select()
        .single();

    if (error) throw error;
    return data as Task;
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
        .from('task')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Task;
}

export async function deleteTask(id: number): Promise<void> {
    const { error } = await supabase
        .from('task')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
