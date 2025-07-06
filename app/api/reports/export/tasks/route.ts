import { exportTaskReport } from "@/controllers/reportController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const auth = await protect(req);
    if(auth instanceof NextResponse ) return auth;

    const admin = adminOnly(auth);
    if(admin instanceof NextResponse) return admin;

    return exportTaskReport(req);
}