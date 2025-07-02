"use client";

import { AddAttachmentsInput } from "@/Components/Inputs/AddAttachmentsInput";
import { SelectDropdown } from "@/Components/Inputs/SelectDropdown";
import { SelectUsers } from "@/Components/Inputs/SelectUsers";
import TodoListInput from "@/Components/Inputs/TodoListInput";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { PRIORITY_DATA } from "@/utils/data";
import { Priority } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "react-hot-toast";
import moment from "moment";
import { CurrentTask, TaskData, TodoItem } from "@/utils/dataTypes";
import Loading from "@/app/loading";
import { Modal } from "@/Components/Model";
import DeleteAlert from "@/Components/DeleteAlert";

export default function CreateTask() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId"); // ✅ like getting location.state.taskId
  const validTaskId = taskId as string;

  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    priority: Priority.Low,
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  } as TaskData);

  const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(true);

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
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    setIsLoadingTask(true);

    try {
      const todolist = taskData.todoChecklist?.map((item: string) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(error?.response?.data?.message || "Failed to create task.");
    } finally {
      setIsLoadingTask(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setIsLoadingTask(true);

    try {
      const todolist = taskData.todoChecklist?.map((item: string) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];

        const matchedTask = prevTodoChecklist.find(
          (task) => task.text === item
        );

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const cleanedAttachments = taskData.attachments?.filter((url) => !!url);

      const cleanedAssignedTo = taskData.assignedTo?.filter((id) => !!id);

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(validTaskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        assignedTo: cleanedAssignedTo,
        todoChecklist: todolist,
        attachments: cleanedAttachments,
      });

      toast.success("Task Updated Successfully");
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(error?.response?.data?.message || "Failed to create task.");
    } finally {
      setIsLoadingTask(false);
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

    if (validTaskId) {
      updateTask();
      return;
    }
    createTask();
  };

  // Get Task info by Id
  const getTaskDetailsByID = async () => {
    setIsLoadingTask(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(validTaskId)
      );

      if (response.data) {
        const taskInfo = response.data.task;
        setCurrentTask(taskInfo);

        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: taskInfo.assignedTo?.map((user: any) => user.id) || [],
          todoChecklist:
            taskInfo.todoChecklist?.map(
              (item: { text: string }) => item.text
            ) || [],
          attachments: taskInfo.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoadingTask(false);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(validTaskId));

      setOpenDeleteAlert(false);
      toast.success("Expense details deleted successfully");
      router.replace("/admin/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    if (validTaskId) {
      getTaskDetailsByID();
    } else {
      setIsLoadingTask(false); // ✅ Mark loading as done when no taskId
    }
  }, [validTaskId]);

  if (isLoadingTask) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl">Create Task</h2>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-col-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-center">
              <h2 className="text-xl md:text-xl font-medium">
                {validTaskId ? "Update Task" : "Create Task"}
              </h2>

              {validTaskId && (
                <button
                  className="flex items-center gap-1.5 ml-2 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
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
                value={taskData.title || ""}
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

            {/* Task Priority & Due Date & Assign To */}
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
                  setSelectedUsers={(value: string[]) => {
                    handleValueChange("assignedTo", value);
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
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
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
                disabled={isLoadingTask}
              >
                {validTaskId ? "UPDATE TASK" : "CREATE TASK"}
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
