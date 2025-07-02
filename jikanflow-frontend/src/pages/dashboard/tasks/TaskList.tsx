import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    CalendarDays,
    StickyNote,
    Pencil,
    Trash2,
    Eye,
} from 'lucide-react';

interface Props {
    task: {
        name: string;
        color: string;
        description: string;
        notes: number;
        due: string;
        priority: string;
        id: string;
        orderIndex: number;
        projectId: string;
    };
}

function TaskList({ task }: Props) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEdit = () => alert(`Edit task: ${task.name}`);
    const handleDelete = () => alert(`Delete task: ${task.name}`);
    const handleView = () => alert(`View details of: ${task.name}`);

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="bg-white rounded-xl shadow-md px-5 py-4 border border-gray-200 hover:shadow-lg transition duration-200 cursor-grab flex flex-col justify-between"
        >
            {/* Top Actions */}
            <div className="flex justify-between items-start mb-3">
                <span className={`w-3 h-3 rounded-full ${task.color}`} title="Status" />
                <div className="flex gap-2">
                    <button
                        onClick={handleEdit}
                        className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50 transition"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded-md hover:bg-red-50 transition"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Title & Description */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-900 text-base mb-1 truncate">
                    {task.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-yellow-600">
                        <StickyNote className="w-4 h-4" />
                        {task.notes} notes
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full 
                        ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                            task.priority === 'LOW' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'}`}>
                        {task.priority}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarDays className="w-4 h-4 text-purple-400" />
                    Due: {task.due}
                </div>
            </div>

            {/* View Details Button */}
            <div className="mt-4 pt-2 border-t border-gray-100">
                <button
                    onClick={handleView}
                    className="w-full flex justify-center items-center gap-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </button>
            </div>
        </div>
    );
}

export default TaskList;
