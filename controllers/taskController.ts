import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse as res } from "next/server";

// Get all tasks
export const getTasks = async (req: NextRequest, user: any) => {
  try {
    // Add logic to fetch tasks from DB
    const { status } = await req.json();
    
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (user.role !== "admin") {
      where.assignedTo = {
        some: {
          id: user.id,
        },
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Get a single task by ID
export const getTaskById = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Fetch task by ID from DB
    return res.json(
      { message: `Task ${params.id} fetched successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Create a new task
export const createTask = async (req: NextRequest, user: any) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      todoChecklist,
      attachments,
    } = await req.json();
    // Validate the dueDate before converting
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return res.json({ message: "Invalid due date" }, { status: 400 });
    }

    if (!Array.isArray(assignedTo)) {
      return res.json(
        { message: "AssignedTo must be an array of user IDs" },
        { status: 400 }
      );
    }
    // Save task to DB
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: parsedDueDate,
        createdBy: {
          connect: { id: user.id },
        },
        assignedTo: {
          connect: assignedTo.map((id: string) => ({ id })),
        },
        attachments: attachments ?? [],
        todoChecklist: todoChecklist.map((item: any) => ({
          text: item.text,
          completed: item.completed,
        })),
      },
    });

    return res.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Update an existing task
export const updateTask = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { title, description } = await req.json();
    // Update task in DB
    return res.json({ message: "Task updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Delete a task
export const deleteTask = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Delete task from DB
    return res.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Update task status
export const updateTaskStatus = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { status } = await req.json();
    // Update task status in DB
    return res.json(
      { message: "Task status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Update task checklist
export const updateTaskChecklist = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { checklist } = await req.json();
    // Update checklist in DB
    return res.json(
      { message: "Task checklist updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task checklist:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Get dashboard data
export const getDashboardData = async (req: NextRequest) => {
  try {
    // Fetch dashboard data
    return res.json(
      { message: "Dashboard data fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Get user-specific dashboard data
export const getUserDashboardData = async (req: NextRequest) => {
  try {
    // Fetch user dashboard data
    return res.json(
      { message: "User dashboard data fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};
