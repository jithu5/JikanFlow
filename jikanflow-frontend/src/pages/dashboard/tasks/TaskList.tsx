import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays, Clock4, StickyNote, Eye } from 'lucide-react';

interface Props {
    task: {
        title: string;
        color: string;
        desc: string;
        time: string;
        notes: number;
        due: string;
        priority: string;
        id: number;
    };
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
            className="group bg-white rounded-lg shadow-md px-4 py-3 border border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-1">
                        {task.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{task.desc}</p>
                </div>
                <span
                    className={`w-3 h-3 mt-1 rounded-full ${task.color}`}
                    title="Status indicator"
                />
            </div>

            {/* Info Rows */}
            <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                        <Clock4 className="w-4 h-4 text-blue-400" />
                        {task.time}
                    </span>
                    <span className="flex items-center gap-1">
                        <StickyNote className="w-4 h-4 text-yellow-400" />
                        {task.notes}
                    </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-purple-400" />
                        {task.due}
                    </span>
                    <span className="italic text-right">{task.priority}</span>
                </div>
            </div>

            {/* Action */}
            <div className="mt-4">
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition">
                    <Eye className="w-4 h-4" />
                    View Details
                </button>
            </div>
        </div>
    );
}

export default TaskList;
