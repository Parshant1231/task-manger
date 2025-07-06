"use client";

import { InfoCard } from "@/Components/Cards/InfoCard";
import { CustomBarChart } from "@/Components/Charts/CustomBarChart";
import { CustomPieChart } from "@/Components/Charts/CustomPieChart";
import { TaskListTable } from "@/Components/TaskListTable";
import { userContext } from "@/context/userContext";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { BarChartItem, DashboardDataDT, PieChartItem } from "@/utils/dataTypes";
import { addThousandsSeparator, getFirstName } from "@/utils/helper";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { LuSquareArrowRight } from "react-icons/lu";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

export default function Dashboard() {
  const { user } = useContext(userContext);

  const navigate = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardDataDT | null>(
    null
  );
  const [pieChartData, setPieChartData] = useState<PieChartItem[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartItem[]>([]);

  // Prepare Chart Data
  const prepareChartData = (charts: any) => {
    const taskDistribution = charts.taskDistribution || null;
    const taskPriorityLevels = charts.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  // Get the all dashboard data like statistics, charts, recentTasks evaluate from the API
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        // Only the `statistics`, `charts`, and `recentTasks` are needed
        const { statistics, charts, recentTasks } = response.data;
        setDashboardData({ statistics, charts, recentTasks });
        prepareChartData(charts);
      }
    } catch (error) {
      console.log("Error might be: ", error);
      throw error;
    }
  };

  const onSeeMore = () => {
    navigate.replace("./tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);


  return (
    <div className="bg-gray-50">
      {/* User Card & Data */}
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              {" "}
              Good Morning! {getFirstName(user?.name)}{" "}
            </h2>
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>
        <div>
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>

            <CustomBarChart data={barChartData} />
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-medium"> Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuSquareArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
