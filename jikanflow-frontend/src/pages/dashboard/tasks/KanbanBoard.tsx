import { useEffect, useState } from "react";
import {
    Kanban,
    PlusCircle,
} from "lucide-react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import Tasks from "./Tasks";
import AddTask from "./AddTask";
import { getStompClient } from "../../../lib/socket";
import { useParams } from "react-router-dom";
import { useAddTask } from "@/apiQuery/apiQuery";
import useUserStore from "@/store/user";

export interface IForm {
    name: string;
    description: string;
    status: string;
}

export interface ITask extends IForm {
    time: string;
    notes: number;
    priority: string;
    due: string;
    id: string;
    orderIndex: number;
    projectId: string;
}

export type TaskMap = {
    [key: string]: ITask[];
};

function KanbanBoard() {
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const { projectId: project_id } = useParams<{ projectId: string }>();
    const { token } = useUserStore();

    useEffect(() => {
        const client = getStompClient();

        client.onConnect = () => {
            console.log("🟢 STOMP connected");
            client.subscribe(`/topic/project/${project_id}`, (message) => {
                const payload = JSON.parse(message.body);
                console.log("📨 Received update", payload);
                // TODO: Handle real-time update
            });
        };

        if (!client.active) client.activate();

        return () => {
            if (client.active) {
                console.log("🔴 Disconnecting WebSocket...");
                client.deactivate();
            }
        };
    }, [project_id]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
        name: "",
        description: "",
        status: "TODO",
    });

    const addTaskMutation = useAddTask(token);

    const handleAddTask = async () => {
        const tempTask: ITask = {
            ...form,
            time: "00:00:00",
            notes: 0,
            priority: "MEDIUM",
            due: "2025-07-01",
            id: String(Date.now()),
            orderIndex: tasks[form.status].length,
            projectId: project_id ?? "",
        };
         interface ITaskSend {
            name: string;
            description: string;
            status: "TODO" | "IN_PROGRESS" | "HOLD" | "REMOVE" | "DONE";
            priority: "LOW" | "MEDIUM" | "HIGH";
            orderIndex: number;
            due: string; // ISO date string, e.g., "2025-07-01"
            projectId: string; // UUID
        }
        const toSend:ITaskSend= {
            description: tempTask.description,
            name: tempTask.name,
            priority: tempTask.priority as "MEDIUM" | "LOW" | "HIGH",
            due: tempTask.due,
            status: tempTask.status === "IN PROGRESS" ? "IN_PROGRESS" : tempTask.status as "TODO" | "HOLD" | "REMOVE" | "DONE" | "IN_PROGRESS",
            orderIndex: tempTask.orderIndex,
            projectId: tempTask.projectId,
        };

        try {
            const savedTask = await addTaskMutation.mutateAsync(toSend);
            setTasks((prev) => ({
                ...prev,
                [form.status]: [...prev[form.status], savedTask],
            }));
        } catch (err) {
            console.error("❌ Error adding task:", err);
        }

        setForm({ name: "", description: "", status: "TODO" });
        setIsOpen(false);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const stompClient = getStompClient();

        for (const status in tasks) {
            const found = tasks[status].find((task) => task.id === active.id);
            if (found) {
                const updatedTask = { ...found, status };
                setActiveTask(updatedTask);

                stompClient.publish({
                    destination: "/app/task-drag-started",
                    body: JSON.stringify({
                        message:"Task is moving",
                        projectId:project_id
                    }),
                });

                break;
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!active || !over || !activeTask) return;

        const fromStatus = activeTask.status;
        let toStatus: string | undefined = undefined;
        let toIndex: number | null = null;

        for (const status in tasks) {
            const found = tasks[status].find((t) => t.id === over.id);
            if (found) {
                toStatus = status;
                break;
            }
        }

        if (!toStatus && tasks[over.id.toString()]) {
            toStatus = over.id.toString();
        }

        if (!toStatus || fromStatus === toStatus) return;

        setTasks((prev) => {
            const updated = { ...prev };
            const taskToMove = { ...activeTask, status: toStatus! };

            updated[fromStatus] = updated[fromStatus].filter((t) => t.id !== active.id);
            updated[toStatus] = [...updated[toStatus], taskToMove];

            return updated;
        });

        setActiveTask({ ...activeTask, status: toStatus });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !activeTask) {
            setActiveTask(null);
            return;
        }

        const fromColumn = activeTask.status;
        let toColumn: string | undefined = undefined;
        let toIndex: number | null = null;

        // Step 1: Try to identify if dropped on a task
        for (const status in tasks) {
            const idx = tasks[status].findIndex((t) => t.id === over.id);
            if (idx !== -1) {
                toColumn = status;
                toIndex = idx;
                break;
            }
        }

        // Step 2: If dropped on column itself (empty column), fallback
        if (!toColumn) {
            toColumn = over.id.toString();
            toIndex = 0; // add to bottom
        }

        if (!toColumn || !tasks[toColumn]) {
            setActiveTask(null);
            return;
        }

        // 🔄 SAME COLUMN REORDER
        if (fromColumn === toColumn) {
            setTasks((prev) => {
                const list = [...prev[toColumn]];
                const taskIndex = list.findIndex((t) => t.id === active.id);
                const [movedTask] = list.splice(taskIndex, 1);

                if (toIndex !== null) {
                    list.splice(toIndex, 0, movedTask);
                } else {
                    list.push(movedTask);
                }

                // ✅ Recalculate orderIndex
                const reordered = list.map((task, idx) => ({ ...task, orderIndex: idx }));

                return { ...prev, [fromColumn]: reordered };
            });
        }

        // 🔁 MOVED TO NEW COLUMN
        else {
            setTasks((prev) => {
                const fromList = prev[fromColumn].filter((t) => t.id !== active.id);
                const toList = [...prev[toColumn!]];
                const moved = { ...activeTask, status: toColumn! };

                if (toIndex !== null) {
                    toList.splice(toIndex, 0, moved);
                } else {
                    toList.push(moved);
                }

                // ✅ Recalculate orderIndex for both columns
                const updatedFrom = fromList.map((task, idx) => ({ ...task, orderIndex: idx }));
                const updatedTo = toList.map((task, idx) => ({ ...task, orderIndex: idx }));

                return {
                    ...prev,
                    [fromColumn]: updatedFrom,
                    [toColumn!]: updatedTo,
                };
            });
        }

        setActiveTask(null);
    };
    

    return (
        <div className="p-4 md:p-6 bg-white min-h-screen relative">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Kanban className="w-6 h-6 text-blue-600" />
                    Kanban Board
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Create, manage, and monitor your tasks in a unified dashboard.
                </p>
            </div>

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
                            <div className={`px-4 py-3 font-semibold text-sm uppercase ${col.label} bg-gray-100 sticky top-0 z-10 border-b`}>
                                {col.title}
                            </div>
                            <Tasks tasks={tasks} col={col} activeTask={activeTask} />
                        </div>
                    ))}
                </div>

                <DragOverlay>
                    {activeTask && (
                        <div className="bg-white border border-blue-500 rounded-xl shadow-xl p-4 w-40 opacity-80 scale-105 transition-transform duration-200">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 text-md truncate">
                                    {activeTask.name}
                                </h4>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${activeTask.priority === "High"
                                        ? "bg-red-100 text-red-600"
                                        : activeTask.priority === "Low"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-yellow-100 text-yellow-600"
                                    }`}>
                                    {activeTask.priority}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{activeTask.description}</p>
                            <div className="flex justify-between items-center mt-3 text-gray-400 text-xs">
                                <div className="flex items-center gap-1">⏱️ {activeTask.time}</div>
                                <div className="flex items-center gap-1">📝 {activeTask.notes} notes</div>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            <button
                onClick={() => setIsOpen(true)}
                className="fixed z-30 bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
            >
                <PlusCircle className="w-5 h-5" />
                Add Task
            </button>

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
