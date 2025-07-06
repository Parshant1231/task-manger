"use client";

import { TaskCard } from "@/Components/Cards/TaskCard";
import { TaskStatusTabs } from "@/Components/TaskStatusTabs";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { StatusTab, TaskType } from "@/utils/dataTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyTask() {
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const [tabs, setTabs] = useState<StatusTab[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const router = useRouter();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(
        Array.isArray(response?.data?.tasks) ? response.data.tasks : []
      );

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pending || 0 },
        { label: "InProgress", count: statusSummary.inProgress || 0 },
        { label: "Completed", count: statusSummary.completed || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleClick = (taskId: string) => {
    router.push(`/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks();
    return () => {};
  }, [filterStatus]);

  return (
    <div>
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:textxl font-medium">My Tasks</h2>
          </div>

          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((item) => (
            <TaskCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              attachments={item.attachments}
              assignedTo={item.assignedTo.map((a) => a.profileImageUrl)} // ✅ string[]
              completedTodoCount={item.completedTodoCount}
              todoChecklist={item.todoChecklist}
              onClick={() => handleClick(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
