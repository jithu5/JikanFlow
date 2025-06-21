import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ITask, TaskMap } from './KanbanBoard';
import TaskList from './TaskList';

interface Props {
    tasks: TaskMap;
    col: {
        title: string;
        color: string;
        label: string;
    };
    activeTask: ITask | null;
}

function Tasks({ tasks, col, activeTask }: Props) {
    const taskList = tasks[col.title] || [];

    return (
        <div className="flex-1 space-y-2 p-2">
            <SortableContext
                items={taskList.map(task => task.id)} // use stable IDs
                strategy={verticalListSortingStrategy}
            >
                {taskList.map((task) => (
                    <TaskList key={task.id} task={{ ...task, color: col.color }} />
                ))}
            </SortableContext>
        </div>
    );
}

export default Tasks;