import {  getUserById } from "@/controllers/userController";
import { adminOnly, protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await protect(req);
    if (auth instanceof NextResponse) return auth;
  
    return getUserById(params.id); // call your controller function
  }
  
