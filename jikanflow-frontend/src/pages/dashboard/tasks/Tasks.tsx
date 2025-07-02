import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskMap } from './KanbanBoard';
import TaskList from './TaskList';
import { useDroppable } from '@dnd-kit/core';

interface Props {
    tasks: TaskMap;
    col: {
        title: string;
        color: string;
        label: string;
    };
}

function Tasks({ tasks, col }: Props) {
    const taskList = tasks[col.title] || [];
    const { setNodeRef } = useDroppable({
        id: col.title, // this is what `over.id` will be during a drop over empty column
      });
    return (
        <div ref={setNodeRef} className="flex-1 space-y-2 p-2">
            <SortableContext
                items={taskList.map(task => task.id)} // use stable IDs
                strategy={verticalListSortingStrategy}
            >
                {/* Makes a shallow copy of tasks and sort it with orderIndex and map it to UI */}
                {[...taskList]
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((task) => (
                        <TaskList
                            key={task.id}
                            task={{
                                ...task,
                                id: String(task.id),
                                color: col.color
                            }}
                        />
                    ))}

            </SortableContext>
        </div>
    );
}

export default Tasks;