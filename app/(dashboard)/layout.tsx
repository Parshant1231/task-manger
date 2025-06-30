"use client";

import Navbar from "@/Components/Navbar";
import SideMenu from "@/Components/SideMenu";
import { userContext } from "@/context/userContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import React, { ReactNode, useContext } from "react";
import Loading from "../loading";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(userContext);
  const { authReady } = useUserAuth(); // ✅ Important: add this line

  // ✅ Wait until user + role check is complete
  if (loading || !user || !authReady) return <Loading />;

  return (
    <div key={user?.role}>
      <Navbar />
      <div className="flex bg-gray-50">
        <div className="max-[1080px]:hidden">
          <SideMenu />
        </div>
        <div className="grow mx-5">{children}</div>
      </div>
    </div>
  );
}
