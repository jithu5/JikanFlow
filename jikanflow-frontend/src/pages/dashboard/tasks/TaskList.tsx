import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays, Clock4, StickyNote } from 'lucide-react';

interface Props {
    task: {
        title: string;
        color: string;
        desc: string;
        time: string;
        notes: number;
        due: string;
        priority: string;
        id: number
    }
}

function TaskList({ task }: Props) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="bg-white px-3 py-3 border-b border-gray-200 hover:border-blue-500 transition"
        >
            <div
                key={task.id}
                className="bg-white px-3 py-3 border-b border-gray-200 hover:border-blue-500 transition"
            >
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-sm text-gray-800">
                        {task.title}
                    </h4>
                    <span className={`w-2 h-2 rounded-full ${task.color}`} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{task.desc}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                        <Clock4 className="w-4 h-4" />
                        {task.time}
                    </div>
                    <div className="flex items-center gap-1">
                        <StickyNote className="w-4 h-4" />
                        {task.notes}
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {task.due}
                    </div>
                    <span className="italic">{task.priority}</span>
                </div>
            </div>
        </div>
    );
}
export default TaskList;