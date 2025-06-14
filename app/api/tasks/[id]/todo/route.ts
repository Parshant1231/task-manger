import { updateTaskChecklist } from "@/controllers/taskController";
import { protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  return updateTaskChecklist(req, context);
}
