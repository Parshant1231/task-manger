import { deleteTask, getTaskById, updateTask } from "@/controllers/taskController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  return getTaskById(req, context);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  return updateTask(req, context); // you can pass `auth` too if needed
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const auth = await protect(req);
  if (auth instanceof NextResponse) return auth;

  const adminCheck = adminOnly(auth);
  if (adminCheck instanceof NextResponse) return adminCheck;

  return deleteTask(req, context); // admin-only function
}
