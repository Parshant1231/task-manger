"use client";

export interface UserType {
  completedTasks: number;
  createdAt: string;
  email: string;
  id: string;
  inProgressTasks: number;
  name: number;
  pendingTasks: number;
  profileImageUrl: string;
  role: Role;
  updatedAt: string;
}

import UserCard from "@/Components/Cards/UserCard";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuFileSpreadsheet } from "react-icons/lu";

export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  //   All Users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  //   Download User report
const handleDownloadReport = async () => {
  try {

    const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
      responseType: "blob",
    });

    // Create blob URL & auto-download
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "user_report.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download task report.");
  }
};
  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <div>
      <div className="mt-5 mb-10">
        <div className="flex flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {allUsers?.map((user) => (
            <UserCard key={user.id} userInfo={user} />
        ))}
      </div>
    </div>
  );
}
