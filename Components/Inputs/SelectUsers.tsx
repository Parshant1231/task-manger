"use client";

import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { Modal } from "../Model";
import Image from "next/image";
import { AvatarGroup } from "../AvtarGroup";
import { User } from "@prisma/client";

type SelectUsersProps = {
  selectedUsers: string[]; // ✅ IDs
  setSelectedUsers: (ids: string[]) => void;
};

export const SelectUsers = ({
  selectedUsers,
  setSelectedUsers,
}: SelectUsersProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<User[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      console.log("📦 Response from GET_ALL_USERS:", response.data);

      if (response.data?.length > 0) {
        setAllUsers(response.data);
      } else {
        console.warn("⚠️ No users found in response.");
      }
    } catch (error) {
      console.error("🚨 Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setTempSelectedUsers((prev: User[]) => {
      const exists = prev.some((user) => user.id === userId);

      if (exists) {
        return prev.filter((user) => user.id !== userId);
      } else {
        const newUser = allUsers.find((user) => user.id === userId);
        return newUser ? [...prev, newUser] : prev;
      }
    });
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers.map((u) => u.id));
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user: any) => selectedUsers.includes(user.id))
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
            const selectedFullUsers = allUsers.filter((user) =>
              selectedUsers.includes(user.id)
            );
            console.log("✅ Selected IDs:", selectedUsers);
            console.log("🧠 Matching Users:", selectedFullUsers);
            setTempSelectedUsers(selectedFullUsers); // ✅ we're now syncing correctly
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
            const selectedFullUsers = allUsers.filter((user) =>
              selectedUsers.includes(user.id)
            );
            console.log("✅ Selected IDs:", selectedUsers);
            console.log("🧠 Matching Users:", selectedFullUsers);
            setTempSelectedUsers(selectedFullUsers); // ✅ we're now syncing correctly
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
                  checked={tempSelectedUsers.some((u) => u.id === user.id)}
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
