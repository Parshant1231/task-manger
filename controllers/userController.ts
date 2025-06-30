import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const getUsers = async () => {
  try {
    // Fetch users with role 'member', excluding password
    const users = await prisma.user.findMany({
      where: { role: "member" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true
        // exclude password
      },
    });

    // Add task counts

    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const [pendingTasks, inProgressTasks, completedTasks] =
          await Promise.all([
            prisma.task.count({
              where: {
                status: Status.Pending,
                assignedTo: {
                  some: { id: user.id }, // Check if the task is assigned to this user
                },
              },
            }),
            prisma.task.count({
              where: {
                status: Status.InProgress,
                assignedTo: {
                  some: { id: user.id },
                },
              },
            }),
            prisma.task.count({
              where: {
                status: Status.Completed,
                assignedTo: {
                  some: { id: user.id },
                },
              },
            }),
          ]);

        return {
          ...user,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );
    return NextResponse.json(usersWithTaskCounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const getUserById = async (userId: string) => {
  try {
    // Logic to fetch user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // exclude password
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

