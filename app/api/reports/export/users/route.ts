import { exportUsersReport } from "@/controllers/reportController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const auth = await protect(req);
    const admin =  adminOnly(req);

    if(auth instanceof NextResponse ) return auth;
    if(admin instanceof NextResponse) return admin;

    return exportUsersReport(req);
}