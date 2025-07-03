import type { ITask, TaskMap } from "@/pages/dashboard/tasks/KanbanBoard";
import { create } from "zustand";

interface ITaskStore {
    tasks:TaskMap,
    setTasks:(tasks: TaskMap)=>void
    addTask:(task:ITask)=>void,
    removeTask:(taskId:string)=> void
}

const useTaskStore = create<ITaskStore>((set) => ({
    tasks: {
        TODO: [],
        "IN PROGRESS": [],
        HOLD: [],
        REMOVE: [],
        DONE: [],
    },
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => {
        const updatedTasks = { ...state.tasks };
        if (!updatedTasks[task.status]) {
            updatedTasks[task.status] = [];
        }
        updatedTasks[task.status].push(task);
        return { tasks: updatedTasks };
    }),
    removeTask: (taskId) => set((state) => {
        const updatedTasks = { ...state.tasks };
        Object.keys(updatedTasks).forEach((key) => {
            updatedTasks[key] = updatedTasks[key].filter(task => task.id !== taskId);
        });
        console.log(updatedTasks)
        return { tasks: updatedTasks };
    }),
}));

export default useTaskStore;