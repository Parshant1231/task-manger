import { createTask, getTasks } from "@/controllers/taskController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  return getTasks(req, auth);
}

export async function POST(req: NextRequest) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  const adminCheck = adminOnly(auth);
  if (adminCheck instanceof NextResponse) return adminCheck;

  return createTask(req, auth);
}
