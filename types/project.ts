export interface Project {
    id: number;
    name: string;
    client: string;
    service: string;
    status: string;
    progress: number;
    start_date: string; // o Date si hacés parsing
    end_date: string;
    last_update: string;
    responsible: string;
    description: string;
    collaborators: {
        id: string;
        collaboratorId: string;
        collaboratorName: string;
        role: string;
    }[];
    budget: number;
    cost: number;
    created_at: string;
    updated_at: string;
}
