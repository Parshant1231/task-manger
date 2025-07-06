"use client";

import { AddAttachmentsInput } from "@/Components/Inputs/AddAttachmentsInput";
import { SelectDropdown } from "@/Components/Inputs/SelectDropdown";
import { SelectUsers } from "@/Components/Inputs/SelectUsers";
import TodoListInput from "@/Components/Inputs/TodoListInput";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { PRIORITY_DATA } from "@/utils/data";
import { Priority } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "react-hot-toast";
import moment from "moment";
import { TaskData, TodoItem, UserData } from "@/utils/dataTypes";
import { useRouter } from "next/navigation";
import { Modal } from "@/Components/Model";
import DeleteAlert from "@/Components/DeleteAlert";
import { AxiosError } from "axios";

export default function CreateTask() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("taskId");

  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    priority: Priority.Low,
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  const getAllUsers = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
    setAllUsers(res.data);
  };

  const handleValueChange = <K extends keyof TaskData>(
    key: K,
    value: TaskData[K]
  ) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: Priority.Low,
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: taskData.todoChecklist.map((item) => ({
          text: item.text,
          completed: false,
        })),
        assignedTo: taskData.assignedTo.map((user) => user.id), // ✅ Send only array of IDs
      });

      toast.success("Task Created Successfully");
      clearData();
      router.replace("/admin/dashboard");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Error creating task:", err);

      toast.error(err?.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);

    if (!taskId) {
      toast.error("Missing task ID. Cannot update task.");
      return;
    }

    try {
      const prevTodoChecklist: TodoItem[] = currentTask?.todoChecklist || [];

      const todolist: TodoItem[] = taskData.todoChecklist.map((item) => {
        const matched = prevTodoChecklist.find((t) => t.text === item.text);

        return {
          text: item.text,
          completed: matched ? matched.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
        assignedTo: taskData.assignedTo.map((user) => user.id),
      });

      toast.success("Task Updated Successfully");
      router.replace("/admin/tasks");
    } catch (error) {
      console.error("Error during fetching the data ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    // Input validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Add atleast one todo task");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  // Get Task info by Id
  const getTaskDetailsByID = async (taskId: string) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      const taskInfo = response.data.task; // <- confirm if this is the real object

      // console.log("assignedTo to are :", taskInfo.assignedTo);

      if (!taskInfo || !taskInfo.title) {
        console.warn("⚠️ Task data missing or malformed:", taskInfo);
        return;
      }

      if (response.data) {
        const newTaskData: TaskData = {
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: taskInfo.assignedTo || [], // 👈 not mapping to user.id

          todoChecklist:
            taskInfo.todoChecklist?.map((item: TodoItem) => ({
              text: item.text,
              completed: item.completed ?? false,
            })) || [],

          attachments: taskInfo.attachments || [],
        };

        setCurrentTask(taskInfo);
        setTaskData(newTaskData);

        // console.log("✅ Loaded Task Data:", newTaskData);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    if (!taskId) {
      toast.error("Missing task ID. Cannot update task.");
      return;
    }
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

    setOpenDeleteAlert(false);
    toast.success("Expense details deleted successfully");
    router.replace("/admin/tasks");
  };

  useEffect(() => {
    if (!taskId) {
      clearData();
      setCurrentTask(null);
      getAllUsers(); // 🥇 Load first for create mode
      return;
    }
    // console.log("tASK ID IS", taskId);
    // console.log("📦 Updated TaskData:", taskData);

    // 🥇 Fetch users first, then task
    getAllUsers().then(() => {
      getTaskDetailsByID(taskId);
    });
  }, [taskId]);

  return (
    <div>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-col-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-center">
              <h2 className="text-xl md:text-xl font-medium mr-3">
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
            {/* Task Title */}
            <div className="mt-4">
              <label className="text-sm font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title ?? ""}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>
            {/* Task description */}
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

            {/* Task Priority */}
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) =>
                    handleValueChange("priority", value as Priority)
                  }
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
                  selectedUsers={taskData.assignedTo.map((u) => u.id)}
                  setSelectedUsers={(userIds) => {
                    const matchedUsers = allUsers.filter((u) =>
                      userIds.includes(u.id)
                    );
                    handleValueChange("assignedTo", matchedUsers);
                    console.log("🧪 AssignedTo in form:", taskData.assignedTo);
                  }}
                />
              </div>
            </div>

            {/* Task Checklist */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist.map((item) => item.text)}
                setTodoList={(texts: string[]) => {
                  const checklist = texts.map((text) => ({
                    text,
                    completed: false,
                  }));
                  handleValueChange("todoChecklist", checklist);
                }}
              />
            </div>

            {/* Task Attachments */}
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

            {/* Submit & */}
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}
            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </div>
  );
}
