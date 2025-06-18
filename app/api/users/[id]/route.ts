import {  getUserById } from "@/controllers/userController";
import { protect } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const auth = await protect(req);
    const id = context.params.id;
    if (auth instanceof NextResponse) return auth;
  
    return getUserById(id); // call your controller function
  }
  
