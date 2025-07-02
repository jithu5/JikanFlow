import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
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
import useUserTokenStore from "@/store/userToken";
import toast from "react-hot-toast";
import useUserStore from "@/store/user";
import Header from "./Header";

export interface IForm {
    name: string;
    description: string;
    priority: string;
    due: string;
    status: string;
}

export interface ITask extends IForm {
    orderIndex: number;
    notes: number;
    projectId: string;
    id: string;
}

export type TaskMap = {
    [key: string]: ITask[];
};

function KanbanBoard() {
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const [usersMoving, setUsersMoving] = useState<string[]>([]);
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

    const { projectId: project_id } = useParams<{ projectId: string }>();
    const { user } = useUserStore();
    
    const { token } = useUserTokenStore();
    const { data, error, isLoading } = useFetchTasks(token, project_id!);
    const addTaskMutation = useAddTask(token);

    console.log(user)

    useEffect(() => {
        const client = getStompClient();
        client.onConnect = () => {
            console.log("🟢 STOMP connected");
            client.subscribe(`/topic/project/${project_id}`, (message) => {
                const payload = JSON.parse(message.body);
                console.log(payload)
                console.log(user.username)
                if (payload.type == "TASK_DRAG_START") {
                    console.log("object")
                    setUsersMoving((prev) => {
                        // const filtered = prev.filter((u) => u !== payload.username);
                        return [...prev, payload.username];
                    });
                    setTimeout(() => {
                        setUsersMoving((prev) => prev.filter((u) => u !== payload.username));
                    }, 4000);
                }  if (payload.type == "TASK_DRAG_END") {
                    console.log(user.username,payload.username)
                    // if (user.username !== payload.username) {
                        console.log(payload)
                        console.log("object")
        
                        const index = payload.index;
                        const toStatus = payload.toStatus;
                        const taskId = payload.taskId;
                        
                        setTasks((prev)=>{
                            let movedTask: ITask | undefined;
                         
                            const newState = Object.fromEntries(
                                Object.entries(prev).map(([col, list]) => {
                                    const filtered = list.filter((task) => {
                                        if (task.id === taskId) {
                                            movedTask = { ...task };
                                            return false; // Remove the task
                                        }
                                        return true;
                                    });
                                    return [col, filtered];
                                })
                            ) as TaskMap;

                            if (movedTask) {
                                movedTask.status = toStatus;
                                movedTask.orderIndex = index;

                                newState[toStatus] = [...(newState[toStatus] || []), movedTask].sort(
                                    (a, b) => a.orderIndex - b.orderIndex
                                );
                            }

                            return newState;
                        })
                    // }

                }
            });
        };
        if (!client.active) client.activate();
        return () => {
            if (client.active) client.deactivate();
        };
    }, [project_id]);

    useEffect(() => {
        if (data && !error && !isLoading) {
            setTasks({
                TODO: data.filter((d: ITask) => d.status === "TODO"),
                "IN PROGRESS": data.filter((d: ITask) => d.status === "IN_PROGRESS"),
                HOLD: data.filter((d: ITask) => d.status === "HOLD"),
                REMOVE: data.filter((d: ITask) => d.status === "REMOVE"),
                DONE: data.filter((d: ITask) => d.status === "DONE"),
            });
        }
    }, [project_id, data, error, isLoading]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const columns = [
        { title: "TODO", color: "bg-blue-500", label: "text-blue-600" },
        { title: "IN PROGRESS", color: "bg-yellow-500", label: "text-yellow-600" },
        { title: "HOLD", color: "bg-purple-500", label: "text-purple-600" },
        { title: "REMOVE", color: "bg-red-500", label: "text-red-600" },
        { title: "DONE", color: "bg-green-500", label: "text-green-600" },
    ];

    const handleAddTask = async () => {
        interface ITaskSend {
            name: string;
            description: string;
            status: "TODO" | "IN_PROGRESS" | "HOLD" | "REMOVE" | "DONE";
            priority: "LOW" | "MEDIUM" | "HIGH";
            orderIndex: number;
            due: string; 
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
        } catch (err: any) {
            console.error("❌ Error adding task:", err);
            toast.error(err?.response?.data)
        }

        setForm({ name: "", description: "", status: "TODO", due: "", priority: "MEDIUM" });
        setIsOpen(false);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
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

        const fromStatus = activeTask.status;
        let toStatus: string | undefined;

        for (const status in tasks) {
            if (tasks[status].some((t) => t.id === over.id)) {
                toStatus = status;
                break;
            }
        }

        if (!toStatus && tasks[over.id.toString()]) {
            toStatus = over.id.toString();
        }

        if (!toStatus || fromStatus === toStatus) return;

        const stompClient = getStompClient();
        stompClient.publish({
            destination: "/app/task-drag-started",
            body: JSON.stringify({
                type: "TASK_DRAG_START",
                username: user.username,
                projectId: project_id,
                taskId: active.id,
            }),
        });

        setTasks((prev) => {
            const updated = { ...prev };
            const taskToMove = { ...activeTask, status: toStatus! };
            updated[fromStatus] = updated[fromStatus].filter((t) => t.id !== active.id);
            updated[toStatus!] = [...updated[toStatus!], taskToMove];
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
                newOrderIndex = nextTask.orderIndex - 100;
            } else if (prevTask && !nextTask) {
                newOrderIndex = prevTask.orderIndex + 100;
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
                    toStatus: toColumn,
                    username:user.username
                }),
            });

            return { ...prev, [fromColumn]: list };
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
                    toStatus: toColumn,
                    username: user.username
                }),
            });

            return { ...prev, [fromColumn]: fromList, [toColumn]: toList };
        });
    }

    setActiveTask(null);
};


    return (
        <>
            <div className="p-4 md:p-6 bg-white min-h-screen relative">
                <Header usersMoving={usersMoving} user={user} />

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
                            <div className="bg-white border border-blue-500 rounded-xl shadow-xl p-4 w-40 opacity-80 scale-105">
                                <h4 className="font-semibold text-gray-800 text-md truncate">{activeTask.name}</h4>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                {/* ✅ Add Task */}
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
            </div >
        </>
    );
}

export default KanbanBoard;
