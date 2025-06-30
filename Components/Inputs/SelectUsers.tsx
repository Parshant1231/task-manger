"use client";

import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";

type SelectUsersProps = {
  selectedUsers: string[]; // or User[] if you're using user objects
  setSelectedUsers: (users: string[]) => void;
};

export const SelectUsers = ({
  selectedUsers,
  setSelectedUsers,
}: SelectUsersProps) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId: any) => {
    setTempSelectedUsers((prev: any) =>
      prev.includes(userId)
        ? prev.filter((id: any) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user: any) => selectedUsers.includes(user.id))
    .map((user: any) => user.profileImageUrl);


  useEffect(() => {
    if(selectedUsers.length === 0) {
        setTempSelectedUsers([]);
    }
  } ,[selectedUsers])
  return(
<div className="space-y-4 mt-2">
  {selectedUserAvatars.length === 0 && (
    <button className="card-btn" onClick={() => setIsModalOpen(true)}>
      <LuUsers className="text-sm" /> Add Members
    </button>
  )}
</div>)
};
