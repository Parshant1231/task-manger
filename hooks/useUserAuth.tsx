"use client";

import { useContext, useEffect } from "react"
import { userContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

export const useUserAuth = () => {
    const { user,loading, clearUser} = useContext(userContext);
    const router = useRouter();

    useEffect(() => {
        if(loading) return;
        if(user) return;

        if(!user) {
            clearUser();
            router.replace("/login");
        }
    }, [user, router, clearUser]);
}