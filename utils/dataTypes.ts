// ====================
// DASHBOARD DATA TYPES
// ====================

import { Priority, Status } from "@prisma/client";

export interface DashboardStatistics {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface TaskDistribution {
  Pending: number;
  InProgress: number;
  Completed: number;
  All: number;
}

export interface TaskPriorityLevels {
  Low: number;
  Medium: number;
  High: number;
}

export interface Charts {
  taskDistribution: TaskDistribution;
  taskPriorityLevels: TaskPriorityLevels;
}

export interface RecentTask {
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}
export interface DashboardDataDT {
  statistics: DashboardStatistics;
  charts: Charts;
  recentTasks: RecentTask[];
}
export type PieChartItem = {
  status: string;
  count: number;
};

export type BarChartItem = {
  priority: string;
  count: number;
};

// ====================
// TASKS DATA TYPES
// ====================

export interface AssignedToType {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}

export interface TaskType {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: AssignedToType[];
  attachments: {
    url: string;
  }[];
  completedTodoCount: number;
  todoChecklist: {
    title: string;
    isCompleted: boolean;
  }[];
}

export interface StatusTab {
  label: string;
  count: number;
}

export interface TaskStatusTabsProps {
  tabs: StatusTab[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}
export type TaskCardProps = Omit<TaskType, "assignedTo"> & {
  assignedTo: string[]; // profileImageUrl[] only
  onClick: () => void;
};

export type TaskTYPEDS = Omit<TaskType, "todoChecklist" | "attachments">& {
    todoChecklist: {
    text: string;
    completed: boolean;
  }[];
  attachments: string[];
}

// export type TaskData = Omit<TaskType, "id" | "status" | "progress" | "createdAt" | "attachments" | "todoChecklist" | "completedTodoCount"> & {
//   todoChecklist: string[];
//   attachments: string[];
// }

export interface TodoItem {
  text: string;
  completed: boolean;
}


export type UserData =  {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}
export type TaskData = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // or Date | null if using Date objects
  assignedTo: UserData[]; // or User[] if using full user objects
  todoChecklist: TodoItem[];
  attachments: string[]; // or your custom file type
};
export type Attachment = { url: string };
