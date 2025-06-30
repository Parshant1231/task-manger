"use client";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Role } from "@prisma/client";
import React, { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  profileImageUrl: string;
  token: string;
}
interface UserContextType {
    user: User | null;
    loading: boolean;
    updateUser: (userData: any) => void;
    clearUser: () => void;
}

export const userContext = createContext<UserContextType>({
  user: null,
  loading: true,
  updateUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const accesToken = localStorage.getItem("token");
    if (!accesToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("Login failed", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
  };

  const clearUser = () => {
    setUser(null); // or setUser(undefined)
    localStorage.removeItem("token"); // optional: clear auth token
  };

  return (
    <userContext.Provider value={{user, loading, updateUser, clearUser}}>
        {children}
    </userContext.Provider>
  )
};
