// ====================
// DASHBOARD DATA TYPES
// ====================

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