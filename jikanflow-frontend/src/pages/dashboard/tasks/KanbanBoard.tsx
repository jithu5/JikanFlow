import { useEffect, useState } from "react";
import {
    Kanban,
    PlusCircle,
} from "lucide-react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners,type DragEndEvent, type DragOverEvent, type DragStartEvent, DragOverlay } from "@dnd-kit/core";
import Tasks from "./Tasks";
import AddTask from "./AddTask";
import stompClient from "../../../lib/socket"

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

    useEffect(() => {
        stompClient.onConnect = () => {
            console.log("🟢 Connected to WebSocket");

            // Subscribe to updates
            stompClient.subscribe("/topic/project/123e4567-e89b-12d3-a456-426614174000", (message) => {
                const payload = JSON.parse(message.body);
                console.log("🔁 Incoming update", payload);

                // Replace your task state (if full update)
                if (payload.updatedTasks) {
                    const grouped: TaskMap = {
                        TODO: [],
                        "IN PROGRESS": [],
                        HOLD: [],
                        REMOVE: [],
                        DONE: [],
                    };
                    payload.updatedTasks.forEach((task: ITask) => {
                        grouped[task.status].push(task);
                    });
                    setTasks(grouped);
                }
            });
        };

        stompClient.activate();

        return () => {
            if (stompClient.active) stompClient.deactivate();
        };
    }, []);
    

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
        console.log(active)

        // Find the task by ID
        for (const status in tasks) {
            const found = tasks[status].find((task) => task.id === active.id);
            if (found) {
                setActiveTask({ ...found, status });
                break;
            }
            // stompClient.publish({
            //     destination: "/app/task-drag-started",
            //     body: JSON.stringify({
            //         projectId: "123e4567-e89b-12d3-a456-426614174000",
            //         taskId: active.id,
            //         user: "Abijith"
            //     })
            // });
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!active || !over || !activeTask) return;

        const fromColumnStatus = activeTask.status;

        let toColumnStatus: string | undefined;
        let toTaskIndex: number | null = null;

        // ✅ Now over.id can be either a task ID or a column title (if empty column)
        // Try to match task first
        for (const status in tasks) {
            const found = tasks[status].find(t => t.id === Number(over.id));
            if (found) {
                toColumnStatus = status;
                break;
            }
        }

        // ✅ Fallback to assume it's a column (like empty "TODO")
        if (!toColumnStatus && tasks[over.id.toString()]) {
            toColumnStatus = over.id.toString();
        }

        if (!toColumnStatus || fromColumnStatus === toColumnStatus) return;

        setTasks(prev => {
            const newTasks = { ...prev };
            const taskToMove = { ...activeTask, status: toColumnStatus! };

            // Remove from old column
            newTasks[fromColumnStatus] = newTasks[fromColumnStatus].filter(t => t.id !== active.id);

            // Insert into new column
            newTasks[toColumnStatus!] = [...newTasks[toColumnStatus!], taskToMove];

            return newTasks;
        });

        setActiveTask({ ...activeTask, status: toColumnStatus });
    };
    
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !activeTask) {
            setActiveTask(null);
            return;
        }

        const fromColumn = activeTask.status;
        let toColumn: string | undefined;
        let toIndex: number | null = null;

        // Check if dropped on a task
        for (const status in tasks) {
            const taskIndex = tasks[status].findIndex(t => t.id === Number(over.id));
            if (taskIndex !== -1) {
                toColumn = status;
                toIndex = taskIndex;
                break;
            }
        }
        // If dropped on a column
        if (!toColumn) {
            toColumn = over.id.toString();
            
        }

        if (!toColumn || !tasks[toColumn]) {
            setActiveTask(null);
            return;
        }

        // Check if reordering in same column
        if (fromColumn === toColumn) {
            setTasks(prev => {
                const newTasks = { ...prev };
                const fromList = [...newTasks[fromColumn]];
                const taskIndex = fromList.findIndex(t => t.id === active.id);
                const [movedTask] = fromList.splice(taskIndex, 1);

                // Drop before `toIndex`, or at end if dropped on column
                if (toIndex !== null) {
                    fromList.splice(toIndex, 0, movedTask);
                } else {
                    fromList.push(movedTask);
                }

                newTasks[fromColumn] = fromList;
                return newTasks;
            });
            console.log(tasks)

            setActiveTask(null);
            return;
        }

        // If moved to another column
        setTasks(prev => {
            const newTasks = { ...prev };
            const fromList = newTasks[fromColumn].filter(t => t.id !== active.id);
            const toList = [...newTasks[toColumn!]];

            const newTask = { ...activeTask, status: toColumn! };

            if (toIndex !== null) {
                toList.splice(toIndex, 0, newTask);
            } else {
                toList.push(newTask);
            }

            newTasks[fromColumn] = fromList;
            newTasks[toColumn!] = toList;
            console.log(tasks)

            return newTasks;
        });
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
                        <div className="bg-white border border-blue-500 rounded-xl shadow-xl p-4 w-40 opacity-80 scale-105 transition-transform duration-200">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 text-md truncate">
                                    {activeTask.title}
                                </h4>
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${activeTask.priority === "High"
                                            ? "bg-red-100 text-red-600"
                                            : activeTask.priority === "Low"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-yellow-100 text-yellow-600"
                                        }`}
                                >
                                    {activeTask.priority}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{activeTask.desc}</p>
                            <div className="flex justify-between items-center mt-3 text-gray-400 text-xs">
                                <div className="flex items-center gap-1">
                                    ⏱️ <span>{activeTask.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    📝 <span>{activeTask.notes} notes</span>
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