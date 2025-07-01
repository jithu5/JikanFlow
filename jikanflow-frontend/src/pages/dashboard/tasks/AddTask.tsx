import type { IForm } from './KanbanBoard';
import { Dialog } from '@headlessui/react';

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    form: IForm;
    setForm: (form: IForm) => void;
    handleAddTask: () => void;
    columns: { title: string; color: string; label: string }[];
};

function AddTask({ isOpen, setForm, setIsOpen, form, handleAddTask, columns }: Props) {
    const handleSubmit = () => {
        if (!form.name.trim()) {
            alert("Task title is required.");
            return;
        }
        if (!form.due.trim()) {
            alert("Task Date is required.");
            return;
        }
        handleAddTask();
        setIsOpen(false);
         // Optional: close modal on success
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0">
            <div className="flex items-center justify-center min-h-screen bg-black/30 px-4">
                <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                    <Dialog.Title className="text-lg font-bold">Add Task</Dialog.Title>
                    <div className="space-y-2">
                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />

                        {/* Description */}
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />

                        {/* Status */}
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        >
                            {columns.map((col) => (
                                <option key={col.title} value={col.title}>
                                    {col.title}
                                </option>
                            ))}
                        </select>

                        {/* Priority */}
                        <select
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        >
                            {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>

                        {/* Due Date */}
                        <input
                            type="date"
                            value={form.due}
                            required
                            onChange={(e) => setForm({ ...form, due: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />

                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default AddTask;
