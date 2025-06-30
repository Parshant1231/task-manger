"use client";

type TaskData = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // or Date | null if using Date objects
  assignedTo: string[]; // or User[] if using full user objects
  todoCheckList: string[];
  attachments: string[]; // or your custom file type
};

import { AddAttachmentsInput } from "@/Components/Inputs/AddAttachmentsInput";
import { SelectDropdown } from "@/Components/Inputs/SelectDropdown";
import { SelectUsers } from "@/Components/Inputs/SelectUsers";
import TodoListInput from "@/Components/Inputs/TodoListInput";
import { PRIORITY_DATA } from "@/utils/data";
import { Priority } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";

export default function CreateTask() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId"); // ✅ like getting location.state.taskId

  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    priority: Priority.Low,
    dueDate: "",
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key: string, value: any) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: Priority.Low,
      dueDate: "",
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    // Call your backend API
    console.log("Creating task...", taskData);
    // await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(taskData) });
  };

  // Update Task
  const updateTask = async () => {
    console.log("Updating task...", taskData);
    // await fetch(`/api/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(taskData) });
  };

  const handleSubmit = async () => {
    if (taskId) {
      await updateTask();
    } else {
      await createTask();
    }

    clearData();
    router.push("/dashboard"); // or any route you prefer
  };

  // Get Task info by Id
  const getTaskDetailsByID = async () => {};

  // Delete Task
  const deleteTask = async () => {};

  return (
    <div>
      <h2 className="text-xl md:text-2xl">Create Task</h2>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-col-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-center">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>
            {/* Task Title & description */}
            <div className="mt-4">
              <label className="text-sm font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>
            <div className="mt-3">
              <label className="tet-sm font-medium text-slate-600">
                Description
              </label>

              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value: any) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoCheckList}
                setTodoList={(value) =>
                  handleValueChange("todoCheckList", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value: any) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
