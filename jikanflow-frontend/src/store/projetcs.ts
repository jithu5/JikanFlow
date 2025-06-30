import { create } from "zustand";

type ProjectCardData = {
    id: string;
    title: string;
    description: string;
    startedAt: string;
    inProgress: number;
    onHold: number;
    usersCount: number;
};

type ProjectResponse = {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    createdAt: string;
    tasks: Task[] | null;
    users: { username: string; email: string }[];
};

type Task = {
    id: string;
    name: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE" | "REMOVE" | "HOLD";
    priority: "LOW" | "MEDIUM" | "HIGH";
    orderIndex: number;
    due: string;
    createdAt: string | null;
};

interface StoreState {
    projects: ProjectCardData[];
    setProjectsFromApi: (apiData: ProjectResponse[]) => void;
    addProject:(apiData: ProjectResponse)=>void;
}

const useProjectStore = create<StoreState>((set) => ({
    projects: [],

    setProjectsFromApi: (apiData) => {
        const transformed = apiData.map((project) => {
            const inProgress = (project.tasks ?? []).filter(
                (task) => task.status === "IN_PROGRESS"
            ).length;

            const onHold = (project.tasks ?? []).filter(
                (task) => task.status === "HOLD"
            ).length;

            return {
                id: project.id,
                title: project.title,
                description: project.description,
                startedAt: project.createdAt,
                inProgress,
                onHold,
                usersCount: project.users.length,
            };
        });

        set({ projects: transformed });
    },
    addProject: (apiData) => {
        const newProject: ProjectCardData = {
            id: apiData.id,
            title: apiData.title,
            description: apiData.description,
            startedAt: apiData.createdAt,
            inProgress: 0,
            onHold: 0,
            usersCount: apiData.users.length,
        };

        // ✅ actually update the store
        set((state) => ({
            projects: [...state.projects, newProject], // add to top (newest first)
        }));
      },
}));

export default useProjectStore;
