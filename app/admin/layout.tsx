"use client";

import Navbar from "@/Components/Navbar";
import SideMenu from "@/Components/SideMenu";
import { userContext } from "@/context/userContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { usePathname } from "next/navigation";
import React, { ReactNode, useContext } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(userContext);

  useUserAuth();

  const pathname = usePathname();
  const activeMenu = pathname?.split("/")[2] || "Dashboard";
  if (loading) return;

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
}
