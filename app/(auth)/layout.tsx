"use client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { ReactNode, useContext } from "react";
import Loading from "../loading";
import { userContext } from "@/context/userContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { authReady } = useUserAuth();
  const { loading } = useContext(userContext);
  if (loading || !authReady) return <Loading />;

  return (
    <div className="flex">
      {/* Form container */}
      <div className="w-screen min-h-screen md:w-[60vw] bg-white  px-12 pt-8 pb-12 ">
        <h2 className="text-2xl font-semibold">Task Manager</h2>
        {children}
      </div>

      {/* Image container */}
<div className="hidden md:flex w-[40vw] h-screen bg-blue-500 border-1 items-start justify-center">
  <img
    src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ea5d0476339699.5c6694d453222.gif"
    alt="Animated GIF"
    className="w-full h-auto"
  />
</div>

    </div>
  );
}
