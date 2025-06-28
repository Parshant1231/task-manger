// lib/middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

// Helper function to verify JWT and get user
export async function authenticate(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Not authorized, no token", status: 401 };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Fetch user from database excluding password
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
         // include role for admin check
      },
    });

    if (!user) {
      return { error: "Not authorized, user not found", status: 401 };
    }

    return { user, token };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { error: "Not authorized, token expired", status: 401 };
    }
    return { error: "Not authorized, token failed", status: 401 };
  }
}

// Middleware-like wrapper to protect API routes
export async function protect(req: NextRequest) {
  const { user,token, error, status } = await authenticate(req);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }
  // Return the user object for the handler to use
  return { ...user, token };
}

// Middleware for admin-only access check
export function adminOnly(user: any) {
  if (user?.role !== "admin") {
    return NextResponse.json({ message: "Access denied, admin only" }, { status: 403 });
  }
  return null; // allow access
}
