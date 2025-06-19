// //one more updated

import React, { useState, useEffect } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import EditTaskModal from "../components/EditTaskModal";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  PlayCircle,
  Shield,
  User,
  Crown,
} from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = decoded.sub || "User";

  const role = decoded.role || "ROLE_USER";
  const isAdmin = role.includes("ADMIN");

  const getTaskId = (task) => {
    if (!task) return null;

    // Standard MongoDB _id
    if (typeof task._id === "string") return task._id;
    if (typeof task.id === "string") return task.id;

    // Try $oid pattern
    if (task._id?.$oid) return task._id.$oid;
    if (task.id?.$oid) return task.id.$oid;

    // If id is object with timestamp, guess fallback: use backend toString in future
    if (task._id && task._id.timestamp) {
      console.warn("Using fallback ObjectId timestamp:", task._id.timestamp);
      return String(task._id.timestamp);
    }
    if (task.id && task.id.timestamp) {
      console.warn("Using fallback ObjectId timestamp:", task.id.timestamp);
      return String(task.id.timestamp);
    }

    // Last resort: regex
    try {
      const idObject = task.id || task._id;
      const asString = JSON.stringify(idObject);
      const found = asString.match(/[a-f0-9]{24}/i);
      if (found) return found[0];
    } catch {
      /* empty */
    }

    console.error("getTaskId failed! Raw task:", task);
    return null;
  };

  const fetchTasks = async () => {
    try {
      let res;
      if (isAdmin) {
        // Admin sees ALL tasks
        res = await api.get("/admin/tasks");
      } else {
        // User sees only their own tasks
        res = await api.get("/tasks");
      }
      console.log("API Response:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks failed:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (role.includes("ADMIN")) {
      alert("Admins cannot add tasks.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description.");
      return;
    }
    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.error("Add task failed:", err);
      alert("Failed to add task.");
    }
  };

  const updateTask = async (task) => {
    if (role.includes("ADMIN")) {
      alert("Admins cannot update tasks.");
      return;
    }

    const taskId = getTaskId(task);
    console.log("Updating task with ID:", taskId, task);

    if (!taskId) {
      console.error("Invalid ID for update:", task);
      return;
    }

    try {
      await api.put(`/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        status: task.status,
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Update task failed:", err);
    }
  };

  const deleteTask = async (task) => {
    if (role.includes("ADMIN")) {
      alert("Admins cannot delete tasks.");
      return;
    }

    const taskId = getTaskId(task);
    console.log("Deleting task with ID:", taskId, task);

    if (!taskId) {
      console.error("Invalid ID for delete:", task);
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "TODO":
        return {
          label: "To Do",
          icon: Clock,
          color: "from-blue-500 to-cyan-500",
          bgColor: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-200",
          progress: 0,
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: PlayCircle,
          color: "from-amber-500 to-orange-500",
          bgColor: "from-amber-50 to-orange-50",
          borderColor: "border-amber-200",
          progress: 50,
        };
      case "DONE":
        return {
          label: "Done",
          icon: CheckCircle2,
          color: "from-emerald-500 to-green-500",
          bgColor: "from-emerald-50 to-green-50",
          borderColor: "border-emerald-200",
          progress: 100,
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: "from-gray-500 to-gray-600",
          bgColor: "from-gray-50 to-gray-100",
          borderColor: "border-gray-200",
          progress: 0,
        };
    }
  };

  const getOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const doneCount = tasks.filter((task) => task.status === "DONE").length;
    const inProgressCount = tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;
    return Math.round(
      ((doneCount + inProgressCount * 0.5) / tasks.length) * 100
    );
  };

  const getRoleConfig = (role) => {
    const cleanRole = role.replace("ROLE_", "");
    switch (cleanRole) {
      case "ADMIN":
        return {
          label: "Admin",
          icon: Crown,
          color: "from-purple-500 to-indigo-600",
          bgColor: "from-purple-50 to-indigo-50",
          textColor: "text-purple-700",
          description: "Full system access",
        };
      case "USER":
        return {
          label: "User",
          icon: User,
          color: "from-blue-500 to-cyan-500",
          bgColor: "from-blue-50 to-cyan-50",
          textColor: "text-blue-700",
          description: "Standard access",
        };
      default:
        return {
          label: cleanRole,
          icon: Shield,
          color: "from-gray-500 to-gray-600",
          bgColor: "from-gray-50 to-gray-100",
          textColor: "text-gray-700",
          description: "Custom role",
        };
    }
  };

  return (
    <>
      <Navbar username={userName} role={role} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <main className="max-w-7xl mx-auto p-6 pt-8">
          {/* User Role & Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Role Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 h-full">
                {(() => {
                  const roleConfig = getRoleConfig(role);
                  const RoleIcon = roleConfig.icon;
                  return (
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${roleConfig.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <RoleIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Welcome, {userName}!
                      </h3>
                      <div
                        className={`bg-gradient-to-r ${roleConfig.bgColor} rounded-xl p-3 mb-3`}
                      >
                        <p
                          className={`text-sm font-semibold ${roleConfig.textColor} mb-1`}
                        >
                          {roleConfig.label} Access
                        </p>
                        <p className="text-xs text-gray-600">
                          {roleConfig.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span>Role: {roleConfig.label}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Overall Progress Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Project Overview
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Track your progress across all tasks
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">
                      {getOverallProgress()}%
                    </div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>

                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getOverallProgress()}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-emerald-600">
                      {tasks.filter((t) => t.status === "DONE").length}
                    </div>
                    <div className="text-xs text-emerald-700">Completed</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-amber-600">
                      {tasks.filter((t) => t.status === "IN_PROGRESS").length}
                    </div>
                    <div className="text-xs text-amber-700">In Progress</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-blue-600">
                      {tasks.filter((t) => t.status === "TODO").length}
                    </div>
                    <div className="text-xs text-blue-700">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Section */}
          <div className="mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add New Task
                  </h2>
                </div>
                {(() => {
                  const roleConfig = getRoleConfig(role);
                  const RoleIcon = roleConfig.icon;
                  return (
                    <div
                      className={`flex items-center gap-2 bg-gradient-to-r ${roleConfig.bgColor} px-4 py-2 rounded-xl`}
                    >
                      <RoleIcon className="w-4 h-4" />
                      <span
                        className={`text-sm font-medium ${roleConfig.textColor}`}
                      >
                        {roleConfig.label} Mode
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-lg"
                  />
                </div>
                <div className="flex-1">
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-lg"
                  />
                </div>

                <button
                  onClick={addTask}
                  disabled={role.includes("ADMIN")}
                  className={`px-8 py-4 ${
                    role.includes("ADMIN")
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  } text-white font-semibold rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center`}
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {["TODO", "IN_PROGRESS", "DONE"].map((status) => {
              const config = getStatusConfig(status);
              const statusTasks = tasks.filter(
                (task) => task.status === status
              );
              const Icon = config.icon;

              return (
                <div key={status} className="space-y-4">
                  {/* Column Header */}
                  <div
                    className={`bg-gradient-to-r ${config.bgColor} rounded-2xl p-6 border ${config.borderColor} shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {config.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {statusTasks.length} tasks
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-700">
                        {statusTasks.length}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500`}
                        style={{ width: `${config.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                      {config.progress}% Progress
                    </div>
                  </div>

                  {/* Task Cards */}
                  <div className="space-y-4">
                    {statusTasks.map((task) => (
                      <div
                        key={getTaskId(task)}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                            {task.title}
                          </h4>
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-br ${config.color} shadow-lg`}
                          ></div>
                        </div>

                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Task Progress Bar */}
                        <div className="mb-4">
                          <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-700`}
                              style={{ width: `${config.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!role.includes("ADMIN") && (
                            <>
                              <button
                                onClick={() => setEditingTask(task)}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteTask(task)}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {statusTasks.length === 0 && (
                      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200 border-dashed">
                        <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                          No tasks yet
                        </p>
                        <p className="text-sm text-gray-400">
                          Tasks will appear here when added
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {editingTask && !role.includes("ADMIN") && (
            <EditTaskModal
              task={editingTask}
              onClose={() => setEditingTask(null)}
              onSave={updateTask}
              onChange={setEditingTask}
            />
          )}
        </main>
      </div>
    </>
  );
}
