import { getUserDashboardData } from "@/controllers/taskController";
import { protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  return getUserDashboardData(req);
}
