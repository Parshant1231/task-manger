import { updateTaskStatus } from "@/controllers/taskController";
import { protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;
  const id = (await params).id;

  return updateTaskStatus(req, id, auth);
}
