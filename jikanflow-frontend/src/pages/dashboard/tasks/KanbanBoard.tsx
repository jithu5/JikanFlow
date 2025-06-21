import { useState } from "react";
import {
    Kanban,
    PlusCircle,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners,type DragEndEvent, type DragOverEvent, type DragStartEvent, DragOverlay } from "@dnd-kit/core";
import Tasks from "./Tasks";

// Types
interface IForm {
    title: string;
    desc: string;
    status: string;
}

export interface ITask extends IForm {
    time: string;
    notes: number;
    priority: string;
    due: string;
    id:number
}

export type TaskMap = {
    [key: string]: ITask[];
};

function KanbanBoard() {
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Start dragging only after pointer moves 5px
            },
        }),
        // Optional: add KeyboardSensor or TouchSensor if needed
      );

    const columns = [
        { title: "TODO", color: "bg-blue-500", label: "text-blue-600" },
        { title: "IN PROGRESS", color: "bg-yellow-500", label: "text-yellow-600" },
        { title: "HOLD", color: "bg-purple-500", label: "text-purple-600" },
        { title: "REMOVE", color: "bg-red-500", label: "text-red-600" },
        { title: "DONE", color: "bg-green-500", label: "text-green-600" },
    ];

    const [tasks, setTasks] = useState<TaskMap>({
        TODO: [],
        "IN PROGRESS": [],
        HOLD: [],
        REMOVE: [],
        DONE: [],
    });

    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<IForm>({
        title: "",
        desc: "",
        status: "TODO",
    });

    const handleAddTask = () => {
        const newTask: ITask = {
            ...form,
            time: "00:00:00",
            notes: 0,
            priority: "Medium",
            due: "TBD",
            id: Date.now(), // Unique ID based on timestamp
        };

        setTasks((prev) => ({
            ...prev,
            [form.status]: [...prev[form.status], newTask],
        }));

        setForm({ title: "", desc: "", status: "TODO" });
        setIsOpen(false);
    };

    const handleDragStart = (event: DragStartEvent) => {
        console.log(event)
    };
    const handleDragOver = (event: DragOverEvent) => {
        console.log(event)
    };

    const handleDragEnd = (event: DragEndEvent) => {
        console.log(event)
    }; 

    return (
        <div className="p-4 md:p-6 bg-white min-h-screen relative">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Kanban className="w-6 h-6 text-blue-600" />
                    Kanban Board
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Create, manage, and monitor your tasks in a unified dashboard.
                </p>
            </div>

            {/* Table-like Column Layout */}
            <DndContext
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}
                sensors={sensors}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-gray-100">
                    {columns.map((col) => (
                        <div key={col.title} className="flex flex-col border-r border-gray-200 min-h-screen">
                            <div className={`px-4 py-3 font-semibold text-sm uppercase ${col.label} bg-gray-100 sticky top-0 z-10 border-b  border-gray-200`}>
                                {col.title}
                            </div>
                            <Tasks tasks={tasks} col={col} activeTask={activeTask} />
                        </div>
                    ))}
                </div>
                <DragOverlay>
                    {activeTask ? (
                        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
                            <h4 className="font-medium text-sm text-gray-800">{activeTask.title}</h4>
                            <p className="text-xs text-gray-500">{activeTask.desc}</p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                
                                    {activeTask.time}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                    {activeTask.notes}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Floating Add Task Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed z-30 bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
            >
                <PlusCircle className="w-5 h-5" />
                Add Task
            </button>

            {/* Modal for Adding Task */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0">
                <div className="flex items-center justify-center min-h-screen bg-black/30 px-4">
                    <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <Dialog.Title className="text-lg font-bold">Add Task</Dialog.Title>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <textarea
                                placeholder="Description"
                                value={form.desc}
                                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            >
                                {columns.map((col) => (
                                    <option key={col.title} value={col.title}>
                                        {col.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsOpen(false)} className="text-gray-500">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Add
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}

export default KanbanBoard;