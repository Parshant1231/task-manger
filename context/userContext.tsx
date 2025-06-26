"use client";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";

interface UserCOntextType {
    user: string | null;
    loading: boolean;
    updateUser: (userData: any) => void;
    clearUser: () => void;
}

export const userContext = createContext<UserCOntextType>({
  user: null,
  loading: true,
  updateUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (user) return;

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
