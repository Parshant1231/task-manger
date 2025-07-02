"use client";

import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { Modal } from "../Model";
import Image from "next/image";
import { AvatarGroup } from "../AvtarGroup";

type SelectUsersProps = {
  selectedUsers: string[]; // or User[] if you're using user objects
  setSelectedUsers: (users: string[]) => void;
};

type User = {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
};

export const SelectUsers = ({
  selectedUsers,
  setSelectedUsers,
}: SelectUsersProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<string[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      // console.log("All users response:", response.data); // 👈 ADD THIS

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
    .filter((user: any) => user && selectedUsers.includes(user.id)) // ✅ safer filter
    .map((user: any) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button
          className="card-btn"
          onClick={() => {
            setTempSelectedUsers(selectedUsers);
            setIsModalOpen(true);
          }}
        >
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}
      {selectedUserAvatars.length > 0 && (
        <div
          className="cursor-pointer"
          onClick={() => {
            setTempSelectedUsers(selectedUsers); // ✅ important
            setIsModalOpen(true);
          }}
        >
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user: User) => {
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            const imgUrl = user.profileImageUrl?.startsWith("http")
              ? user.profileImageUrl
              : `${baseURL}${user.profileImageUrl}`;

            return (
              <div
                key={user.id}
                className="flex items-center gap-4 p-3 border-b border-gray-200"
              >
                <Image
                  src={imgUrl}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="w-13 h-13 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-[13px] text-gray-500">{user.email}</p>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};
