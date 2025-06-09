// app/api/auth/login/route.ts
import { loginUser } from "@/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return loginUser(req);
}
