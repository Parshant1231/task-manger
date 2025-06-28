"use client";

import { InfoCard } from "@/Components/Cards/InfoCard";
import { userContext } from "@/context/userContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { addThousandsSeparator } from "@/utils/helper";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface DashboardStatistics {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

interface TaskDistribution {
  Pending: number;
  InProgress: number;
  Completed: number;
  All: number;
}

interface TaskPriorityLevels {
  Low: number;
  Medium: number;
  High: number;
}

interface Charts {
  taskDistribution: TaskDistribution;
  taskPriorityLevels: TaskPriorityLevels;
}

interface RecentTask {
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}
interface DashboardData {
  statistics: DashboardStatistics;
  charts: Charts;
  recentTasks: RecentTask[];
}
export default function Dashboard() {
  useUserAuth();


  const { user, loading } = useContext(userContext);
  const navigate = useRouter();

const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
      // Only the `statistics`, `charts`, and `recentTasks` are needed
      const { statistics, charts, recentTasks } = response.data;
      setDashboardData({ statistics, charts, recentTasks });
    }
    } catch (error) {
      console.log("Error might be: ", error);
      throw error;
    }
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return <div className="card my-5">
    
    <div>
        <div className="col-span-3">
            <h2 className="text-xl md:text-2xl"> Good Morning! {user?.name} </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1 5">
                {moment().format("dddd Do MMM YYYY")}
            </p>
        </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 mt-5">
        <InfoCard 
         label="Total Tasks"
         value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.All || 0
         )}
         color="bg-primary"
        />
        <InfoCard 
         label="PEnding Tasks"
         value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Pending || 0
         )}
         color="bg-violet-500"
        />
        <InfoCard 
         label="In Progress Tasks"
         value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.InProgress || 0
         )}
         color="bg-cyan-500"
        />
        <InfoCard 
         label="Completed Tasks"
         value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Completed || 0
         )}
         color="bg-lime-500"
        />
    </div>

  </div>;
}
