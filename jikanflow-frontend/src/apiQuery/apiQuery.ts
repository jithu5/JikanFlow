import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api/api';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface ProjectData {
    title: string,
    description: string
}

export interface ITask {
    name: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "HOLD" | "REMOVE" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    orderIndex: number;
    due: string; // ISO date string, e.g., "2025-07-01"
    projectId: string; // UUID
}
  
// Mutation (ADDING) Queries

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: async (userData: UserData) => {
            const response = await api.post('/api/auth/register', userData);
            return response.data;
        },
    });
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async (userData: LoginData) => {
            const response = await api.post('/api/auth/login', userData);
            return response.data;
        },
    });
};

export const useAddProject = (token: string)=>{
    return useMutation({
        mutationFn:async (projectData: ProjectData)=>{
            const response = await api.post("/api/main/projects/create",projectData,{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response)
            return response.data;
        }
    })
}
export const useAddTask = (token: string)=>{
    return useMutation({
        mutationFn:async (taskData: ITask)=>{
            const response = await api.post("/api/main/tasks/create",taskData,{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response)
            return response.data;
        }
    })
}

// Fetching Queries

export const useFetchAllProjects = (token: string) => {
    
    return useQuery({
        queryKey: ["all-projects"],
        queryFn: async () => {
            try {
                const res = await api.get("/api/main/projects/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return res.data ?? []; // 🔥 Always return something
            } catch (err) {
                console.error("Error fetching projects:", err);
                return []; // 🔥 Fallback to empty array
            }
        },
        enabled: !!token, // prevent firing if token is not ready
    });
};

export const useFetchTasks = (token: string, projectId: string)=>{

    return useQuery({
        queryKey:["all-tasks"],
        queryFn: async ()=>{
            try {
                const res = await api.get(`/api/main/tasks/get-all/${projectId}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                return res.data ?? [];
            } catch (error) {
                return error;
            }
        },
        enabled: !!token
    })
}

// Mutation (UPDATION) Queries
