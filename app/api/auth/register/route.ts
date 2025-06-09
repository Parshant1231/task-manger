// app/api/auth/register/route.ts
import { registerUser } from "@/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return registerUser(req);
}
