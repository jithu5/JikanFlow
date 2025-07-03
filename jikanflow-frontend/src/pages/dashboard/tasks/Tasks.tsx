import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskList from './TaskList';
import { useDroppable } from '@dnd-kit/core';
import useTaskStore from '@/store/Task';

interface IUserDrag {
    taskId: string;
    username: string;
}

interface Props {
    col: {
        title: string;
        color: string;
        label: string;
    };
    usersMoving :IUserDrag[]
}

function Tasks({  col,usersMoving }: Props) {
    const {tasks} = useTaskStore()
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
                            usersMoving={usersMoving}
                        />
                    ))}

            </SortableContext>
        </div>
    );
}

export default Tasks;