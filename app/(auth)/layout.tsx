"use client";

import { useUserAuth } from "@/hooks/useUserAuth";
import { ReactNode, useContext, useState } from "react";
import Loading from "../loading";
import { userContext } from "@/context/userContext";
import { AnimatedTitle } from "@/Components/AnimatedTitle";

const TITLE_PHRASES = [
  "Plan, Organize, Work Better",
  "Ideas That Drive Success",
  "Workflows Built For You",
  "Tasks Done On Time",
  "Focus More, Stress Less",
  "Turning Goals Into Reality",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { authReady } = useUserAuth();
  const { loading } = useContext(userContext);

  if (loading || !authReady) return <Loading />;

  return (
    <div className="flex">
      {/* Form container */}
      <div className="w-screen min-h-screen md:w-[60vw] bg-white px-12 pt-8 pb-12">
        <h2 className="text-2xl font-semibold text-blue-600">Task Manager</h2>
        {children}
      </div>

      {/* Image + Title container */}
      <div className="hidden md:flex w-[40vw] h-screen border border-gray-700 flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* GIF Section (takes ~80% height) */}
        <div
          className="w-full flex justify-center items-center"
          style={{ flexBasis: "80%" }}
        >
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ea5d0476339699.5c6694d453222.gif"
            alt="Animated GIF"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title Section (takes ~20% height) */}
        <div
          className="flex items-center justify-center text-center px-4"
          style={{ flexBasis: "20%" }}
        >
          <h2 className="text-3xl mb-30 md:mb-0 md:text-5xl font-extrabold font-poppins leading-tight">
            <AnimatedTitle phrases={TITLE_PHRASES} />
          </h2>
        </div>
      </div>
    </div>
  );
}
