export interface UserCardProps {
  key: string;
  userInfo: UserType;
}

export interface StatCardType {
  label: string;
  count: number;
  status: Status;
}

import { UserType } from "@/app/(dashboard)/admin/users/page";
import React from "react";
import { Status } from "@prisma/client";

const UserCard = ({ userInfo }: UserCardProps) => {
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl}
            alt={"Avatar"}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="InProgress"
          count={userInfo.inProgressTasks || 0}
          status="InProgress"
        />
        <StatCard
          label="Completed"
          count={userInfo.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }: StatCardType) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "InProgress":
        return "text-cyan-500 bg-gray-50";

      case "Completed":
        return "text-indigo-500 bg-gray-50";

      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
    <span className="text-[12px] font-semibold"> {count} </span> <br /> {label}
  </div>;
};
