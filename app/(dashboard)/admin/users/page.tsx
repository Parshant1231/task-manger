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

  //   Download task report
  const handleDownloadReport = async () => {};

  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <div>
      <h2 className="text-xl md:text-2xl">Create Task</h2>
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
