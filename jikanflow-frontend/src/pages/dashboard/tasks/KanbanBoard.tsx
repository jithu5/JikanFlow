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
import { useAddTask, useFetchTasks } from "@/apiQuery/apiQuery";
import useUserStore from "@/store/user";
import toast from "react-hot-toast";

export interface IForm {
    name: string;
    description: string;
    priority: string;
    due: string;
    status: string
}

export interface ITask extends IForm {
    orderIndex: number,
    notes: number;
    projectId: string;
    id: string
}

export type TaskMap = {
    [key: string]: ITask[];
};

function KanbanBoard() {
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const { projectId: project_id } = useParams<{ projectId: string }>();
    const { token } = useUserStore();
    const { data, error, isLoading } = useFetchTasks(token, project_id!);

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

    useEffect(() => {
        if (data && !error && !isLoading) {
            console.log(data)
            setTasks((prev: TaskMap): TaskMap => ({
                ...prev,
                TODO: data.filter((d: ITask) => d.status === "TODO"),
                "IN PROGRESS": data.filter((d: ITask) => d.status === "IN_PROGRESS"),
                HOLD: data.filter((d: ITask) => d.status === "HOLD"),
                REMOVE: data.filter((d: ITask) => d.status === "REMOVE"),
                DONE: data.filter((d: ITask) => d.status === "DONE"),
            }));
        }
        
    }, [project_id, data, error, isLoading])

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
        priority: "MEDIUM",
        due: "",
    });

    const addTaskMutation = useAddTask(token);

    const handleAddTask = async () => {
        interface ITaskSend {
            name: string;
            description: string;
            status: "TODO" | "IN_PROGRESS" | "HOLD" | "REMOVE" | "DONE";
            priority: "LOW" | "MEDIUM" | "HIGH";
            orderIndex: number;
            due: string; // ISO date string, e.g., "2025-07-01"
            projectId: string; // UUID
        }
        const toSend: ITaskSend = {
            ...form,
            orderIndex: tasks[form.status].length * 100,
            projectId: project_id ?? "",
            status: form.status === "IN PROGRESS" ? "IN_PROGRESS"
                : form.status === "TODO" ? "TODO"
                    : form.status === "HOLD" ? "HOLD"
                        : form.status === "REMOVE" ? "REMOVE"
                            : form.status === "DONE" ? "DONE"
                                : "TODO",
            name: form.name,
            priority: form.priority as "MEDIUM" | "LOW" | "HIGH",
            due: form.due,
        };

        try {
            const savedTask = await addTaskMutation.mutateAsync(toSend);
            setTasks((prev) => ({
                ...prev,
                [form.status]: [...prev[form.status], savedTask],
            }));
            toast.success("Task added successfully")
        } catch (err:any) {
            console.error("❌ Error adding task:", err);
            toast.error(err?.response?.data)
        }

        setForm({ name: "", description: "", status: "TODO", due: "", priority: "MEDIUM" });
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
                        message: `Task is moving by`,
                        taskId: active.id,
                        projectId: project_id
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
        // let toIndex: number | null = null;

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
        const stompClient = getStompClient();

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

                // Remove the dragged task
                const [movedTask] = list.splice(taskIndex, 1);

                if (toIndex !== null) {
                    list.splice(toIndex, 0, movedTask); // Insert at new index
                } else {
                    list.push(movedTask); // Append if no index
                }

                // 🔢 Calculate new fractional index
                let prevTask, nextTask;
                if (toIndex !== null) {
                    prevTask = list[toIndex - 1];
                    nextTask = list[toIndex + 1];
                } else {
                    prevTask = undefined;
                    nextTask = undefined;
                }

                let newOrderIndex: number;
                if (prevTask && nextTask) {
                    newOrderIndex = (prevTask.orderIndex + nextTask.orderIndex) / 2;
                } else if (!prevTask && nextTask) {
                    newOrderIndex = nextTask.orderIndex - 1;
                } else if (prevTask && !nextTask) {
                    newOrderIndex = prevTask.orderIndex + 1;
                } else {
                    newOrderIndex = 0; // Fallback for only one task
                }

                movedTask.orderIndex = newOrderIndex;

                stompClient.publish({
                    destination: "/app/update-tasks",
                    body: JSON.stringify({
                        projectId: project_id,
                        index: newOrderIndex,
                        taskId: activeTask.id,
                        toStatus: toColumn
                    }),
                });


                return { ...prev, [fromColumn]: list };
            });

            // 🔁 Optionally: send movedTask to backend here with new orderIndex
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

                // 🔢 Calculate new fractional index
                let prevTask, nextTask;
                if (toIndex !== null) {
                    prevTask = toList[toIndex - 1];
                    nextTask = toList[toIndex + 1];
                } else {
                    prevTask = undefined;
                    nextTask = undefined;
                }

                let newOrderIndex: number;
                if (prevTask && nextTask) {
                    newOrderIndex = (prevTask.orderIndex + nextTask.orderIndex) / 2;
                } else if (!prevTask && nextTask) {
                    newOrderIndex = nextTask.orderIndex - 100;
                } else if (prevTask && !nextTask) {
                    newOrderIndex = prevTask.orderIndex + 100;
                } else {
                    newOrderIndex = 0; // Fallback for only one task
                }

                moved.orderIndex = newOrderIndex;

                stompClient.publish({
                    destination: "/app/update-tasks",
                    body: JSON.stringify({
                        projectId: project_id,
                        index: newOrderIndex,
                        taskId: activeTask.id,
                        toStatus: toColumn
                    }),
                });

                return { ...prev, [fromColumn]: fromList,[toColumn]: toList};
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
                            <Tasks tasks={tasks} col={col} />
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
