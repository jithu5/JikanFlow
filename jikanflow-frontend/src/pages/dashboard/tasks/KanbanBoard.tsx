import { useState } from "react";
import {
    Kanban,
    PlusCircle,
} from "lucide-react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners,type DragEndEvent, type DragOverEvent, type DragStartEvent, DragOverlay } from "@dnd-kit/core";
import Tasks from "./Tasks";
import AddTask from "./AddTask";

export interface IForm {
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
        const { active } = event;

        // Find the task by ID
        for (const status in tasks) {
            const found = tasks[status].find((task) => task.id === active.id);
            if (found) {
                setActiveTask({ ...found, status });
                break;
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!active || !over || !activeTask) return;
        console.log(over)
        const fromColumnStatus = activeTask.status;
        const task = over.id.toString();
        let toColumnTask: ITask | undefined;
        let toColumnStatus: string | undefined;
        for (const status in tasks) {
            const found = tasks[status].find(t => t.id === Number(task));
            if (found) {
                toColumnTask = found;
                toColumnStatus = status;
                break;
            }
        }

        // Skip if it's not a valid column
        if (!toColumnStatus || !tasks[toColumnStatus]) return;

        if (fromColumnStatus !== toColumnStatus) {
            setTasks((prev) => {
                const newTasks: TaskMap = { ...prev };

                // ✅ Double-check if the target column exists
                if (!newTasks[toColumnStatus]) newTasks[toColumnStatus] = [];

                const alreadyExists = newTasks[toColumnStatus].some((t) => t.id === active.id);
                if (alreadyExists) return prev;

                // Remove from old column
                newTasks[fromColumnStatus] = newTasks[fromColumnStatus].filter((t) => t.id !== active.id);

                // Temporarily add to new column
                newTasks[toColumnStatus] = [...newTasks[toColumnStatus], { ...activeTask, status: toColumnStatus }];

                return newTasks;
            });
            console.log(toColumnTask,fromColumnStatus)
            setActiveTask({ ...activeTask, status: toColumnStatus });
        }
    };
    

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !activeTask) return;

        const fromColumn = activeTask.status;
        let toColumn: string | undefined;

        // 1. Figure out which column the task was dropped into
        for (const status in tasks) {
            const found = tasks[status].some((t) => t.id === Number(over.id));
            if (found) {
                toColumn = status;
                break;
            }
        }

        if (!toColumn || !tasks[toColumn]) {
            setActiveTask(null);
            return;
        }
        console.log('hey')
        // 2. If no change in column, exit early
        if (fromColumn === toColumn) {
            setActiveTask(null);
            return;
        }
        console.log('heeey')

        // 3. Move task to new column
        setTasks((prev) => {
            const newTasks: TaskMap = { ...prev };

            // Remove from old column
            newTasks[fromColumn] = newTasks[fromColumn].filter((t) => t.id !== active.id);

            // Add to new column
            newTasks[toColumn!] = [...newTasks[toColumn!], { ...activeTask, status: toColumn! }];

            return newTasks;
        });
        console.log(toColumn,fromColumn)
        setActiveTask(null);
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
                        <div className="bg-white p-4 rounded shadow-lg border border-rose-600 opacity-50 h-24 w-full">  
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
            <AddTask
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={form}
                setForm={setForm}
                handleAddTask={handleAddTask}
                columns={columns}
            />
        </div>
    );
}

export default KanbanBoard;