"use client";

import { userContext } from "@/context/userContext";
import { useUserAuth } from "@/hooks/useUserAuth"
import { useContext } from "react";

export default function Dashboard(){
    useUserAuth();
    const {user, loading} = useContext(userContext);

    if(loading) return;
    return <div>
        Admin Dashboard
    </div>
}