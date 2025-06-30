import type { IForm } from './KanbanBoard';
import { Dialog } from '@headlessui/react';

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    form: IForm;
    setForm: (form: IForm) => void;
    handleAddTask: () => void;
    columns: { title: string; color: string; label: string }[];
}

function AddTask({isOpen,setForm,setIsOpen,form,handleAddTask,columns}: Props) {
  return (
    <>
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0">
              <div className="flex items-center justify-center min-h-screen bg-black/30 px-4">
                  <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                      <Dialog.Title className="text-lg font-bold">Add Task</Dialog.Title>
                      <div className="space-y-2">
                          <input
                              type="text"
                              placeholder="Title"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full px-3 py-2 border rounded"
                          />
                          <textarea
                              placeholder="Description"
                              value={form.description}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                              className="w-full px-3 py-2 border rounded"
                          />
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
                      </div>
                      <div className="flex justify-end gap-2">
                          <button onClick={() => setIsOpen(false)} className="text-gray-500">
                              Cancel
                          </button>
                          <button
                              onClick={handleAddTask}
                              className="bg-blue-600 text-white px-4 py-2 rounded"
                          >
                              Add
                          </button>
                      </div>
                  </Dialog.Panel>
              </div>
          </Dialog>
    </>
  )
}

export default AddTask