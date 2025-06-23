import {
  deleteTask,
  getTaskById,
  updateTask,
} from "@/controllers/taskController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protect(request);
  if (auth instanceof NextResponse) return auth;

  const id = (await params).id;
  return getTaskById(id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;
  const id = (await params).id;

  return updateTask(req, id); // you can pass `auth` too if needed
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  const adminCheck = adminOnly(auth);
  if (adminCheck instanceof NextResponse) return adminCheck;
  const id = (await params).id;
  return deleteTask(req, id); // admin-only function
}
