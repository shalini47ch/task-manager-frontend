import React from 'react';

export default function EditTaskModal({ task, onClose, onSave, onChange }) {
  if (!task) return null;

  // ✅ Safer handleChange
  const handleChange = (field, value) => {
    onChange({
      ...task,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <input
          value={task.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Title"
          className="border p-2 w-full mb-2"
        />

        <input
          value={task.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description"
          className="border p-2 w-full mb-2"
        />

        <select
          value={task.status || 'TODO'} // ✅ fallback to 'TODO'
          onChange={(e) => handleChange('status', e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Saving:', task); // ✅ Debug: check in console
              onSave(task); // Pass the entire updated task back to Dashboard
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
