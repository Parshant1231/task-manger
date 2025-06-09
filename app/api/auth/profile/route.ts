// app/api/auth/profile/route.ts
import { getUserProfile, updateUserProfile } from "@/controllers/authController";
import { NextRequest, NextResponse } from "next/server";
import { protect } from "@/middleware/auth";

export async function GET(req: NextRequest) {
  const authResult = await protect(req);

  // If it's an error response (NextResponse), return it directly
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // If authenticated, authResult is the user object
  return getUserProfile(authResult);
}


export async function PUT(req: NextRequest) {
  const authResult = await protect(req);

  // If it's an error response (NextResponse), return it directly
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  return updateUserProfile(req, authResult);
}
