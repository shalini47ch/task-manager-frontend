import React from "react";

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="bg-white p-3 mb-3 rounded border shadow-sm">
      <h4 className="font-bold text-lg">{task.title}</h4>
      <p className="text-gray-600">{task.description}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
