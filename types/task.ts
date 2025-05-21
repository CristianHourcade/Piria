export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pendiente' | 'en_progreso' | 'completada';
  due_date: string; // Formato ISO (YYYY-MM-DD)
  responsible: string;
  collaborators: {
    id: string;
    collaboratorId: string;
    collaboratorName: string;
    role: string;
  }[];
  created_at: string;
  updated_at: string;
}
