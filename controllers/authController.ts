// lib/controllers/authController.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import generateToken from "@/lib/generateToken";
import { Role } from "@prisma/client";

export const registerUser = async (req: NextRequest) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const ADMIN_INVITE_TOKEN = process.env.ADMIN_INVITE_TOKEN;
    let role: Role = Role.member; 

    // Determine role
    if (adminInviteToken && adminInviteToken === ADMIN_INVITE_TOKEN) {
      role = Role.admin;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        role,
      },
    });

    const token = generateToken(user.id);

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const loginUser = async (req: NextRequest) => {

  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  
    return NextResponse.json(
      {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user.id),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

// Assumes user data is already extracted from token in middleware
export const getUserProfile = async (user: any) => {
  try {
    return NextResponse.json(
      {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token: user.token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const updateUserProfile = async (req: NextRequest, user: any) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await req.json();

    // Update fields only if present
    const updatedData: any = {
      name: body.name || existingUser.name,
      email: body.email || existingUser.email,
    };

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updatedData,
    });
  
    return NextResponse.json(
      {
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser.id),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const uploadImage = async (req: NextRequest) => {
  if (!req.body) {
    return NextResponse.json(
      { message: "Image is required" },
      { status: 400 }
    );
  }
}