import { getUsers } from "@/controllers/userController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const auth = await protect(req);
    if (auth instanceof NextResponse) return auth;
  
    const adminCheck = adminOnly(auth);
    if (adminCheck instanceof NextResponse) return adminCheck;
  
    return getUsers(); // call your controller function
  }
