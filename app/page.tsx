"use client";

import { userContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const { user, loading } = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    if(loading) return;

    if(!user) {
      router.replace("/login");
    }else if(user.role === "admin"){
      router.replace("/admin/dashboard");
    }else {
      router.replace("/dashboard");
    }

  }, [user, loading, router])

  return null;
}
