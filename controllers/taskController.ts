import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";

// Get all tasks
export const getTasks = async (req: NextRequest, user: any) => {
  try {
    // Add logic to fetch tasks from DB
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as Status | null;

    const where: any = {};

    if (status) {
      where.status = status as Status;
    }

    let tasks;
    if (user.role === "admin") {
      tasks = await prisma.task.findMany({
        where: where,
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
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          ...where,
          assignedTo: {
            some: {
              id: user.id,
            },
          },
        },
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
      });
    }

    tasks = tasks.map((task) => {
      const todoChecklist = task.todoChecklist as { completed: boolean }[];
      const completedCount = todoChecklist.filter(
        (item) => item.completed
      ).length;

      return {
        ...task,
        completedTodoCount: completedCount,
      };
    });

    const allTasks = await prisma.task.count({
      where:
        user.role === "admin"
          ? {}
          : {
              assignedTo: {
                some: { id: user.id },
              },
            },
    });

    const pendingTasks = await prisma.task.count({
      where: {
        ...where,
        status: Status.Pending,
        ...(user.role !== "admin" && {
          assignedTo: {
            some: { id: user.id },
          },
        }),
      },
    });

    const inProgressTasks = await prisma.task.count({
      where: {
        ...where,
        status: Status.InProgress,
        ...(user.role !== "admin" && {
          assignedTo: {
            some: { id: user.id },
          },
        }),
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        ...where,
        status: Status.Completed,
        ...(user.role !== "admin" && {
          assignedTo: {
            some: { id: user.id },
          },
        }),
      },
    });

    return res.json(
      {
        tasks,
        statusSummary: {
          all: allTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Get a single task by ID
export const getTaskById = async (context: { params: { id: string } }) => {
  try {
    // Fetch task by ID from DB
    const id = context.params.id;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!task) {
      return res.json({ message: `Task not found` }, { status: 404 });
    }
    return res.json(
      {
        task,
        message: `Task fetched successfully`,
      },
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
      include: {
        assignedTo: {
          select: { id: true },
        }, // 👈 include the assignedTo relation
      },
    });

    const formattedTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      createdBy: user.id,
      assignedTo: task.assignedTo.map((user) => user.id),
      attachments: attachments ?? [],
      todoChecklist: task.todoChecklist.map((item: any) => ({
        text: item.text,
        completed: item.completed,
      })),
      progress: task.progress,
    };

    return res.json(
      { message: "Task created successfully", formattedTask },
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
  context: { params: { id: string } }
) => {
  try {
    const { params } = context;
    const taskId = params.id;
    const body = await req.json();

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true },
    });

    if (!existingTask) {
      return res.json(
        {
          message: "Task not found",
        },
        { status: 404 }
      );
    }
    if (!Array.isArray(existingTask.assignedTo)) {
      return res.json(
        {
          message: "AssignedTo must be an array of user IDs",
        },
        { status: 400 }
      );
    }

    const updatedData: any = {
      title: body.title || undefined,
      description: body.description || undefined,
      priority: body.priority || undefined,
      dueDate: body.dueDate || undefined,
      assignedTo: body.assignedTo
        ? {
            set: body.assignedTo.map((id: string) => ({ id })),
          }
        : undefined,
      todoChecklist: body.todoChecklist || undefined,
      attachments: body.attachments || undefined,
    };
    const updateTaskData = await prisma.task.update({
      where: { id: taskId },
      data: updatedData,
    });
    // Update task in DB
    return res.json(
      { message: "Task updated successfully", updateTaskData },
      { status: 200 }
    );
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
    const taskId = params.id;
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.json({ message: "Task not found" }, { status: 404 });
    }
    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

// Update task status
export const updateTaskStatus = async (
  req: NextRequest,
  context: { params: { id: string }; user: any }
) => {
  try {
    const body = await req.json();
    const taskId = context.params.id;
    const user = context.user;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true },
    });
    if (!task) {
      return res.json(
        {
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    // Check if the user is assigned to the task
    const isAssigned = task.assignedTo.some(
      (userObj) => userObj.id === user.id
    );
    if (!isAssigned && user.role !== "admin") {
      return res.json({ message: "Not Authorized" }, { status: 403 });
    }

    const updates: any = {
      status: body.status || undefined,
    };
    if (body.status === "Completed") {
      const updatedChecklist = task.todoChecklist.map((item: any) => ({
        ...item,
        completed: true,
      }));

      updates.todoChecklist = updatedChecklist;
      updates.progress = 100;
    } else if (body.status === "InProgress") {
      updates.todoChecklist = task.todoChecklist.map((item: any) => ({
        ...item,
        completed: false, // Reset checklist items when status is InProgress
      }));
      updates.progress = 50;
    } else if (body.status === "Pending") {
      updates.totdochecklist = task.todoChecklist.map((item: any) => ({
        ...item,
        completed: false,
      }));
      updates.progress = 0;
    }

    const updateTask = await prisma.task.update({
      where: { id: taskId },
      data: updates,
      include: { assignedTo: true },
    });

    // // To check if both the id are same or not
    // console.log("Assigned Users:", task.assignedTo);
    // console.log("Current User ID:", user.id);

    // Update task status in DB
    return res.json(
      { message: "Task status updated successfully", updateTask },
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
  { id, user }: { id: string; user: any }
) => {
  try {
    const body = await req.json();
    const todoChecklist = body.todoChecklist
    const taskId = id;
    const userId = user.id;
    const updates: any = {};

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true },
    });
    if (!task) {
      return res.json(
        {
          message: "Task not found",
        },
        { status: 404 }
      );
    }
    if (!Array.isArray(todoChecklist)) {
      return res.json(
        { message: "todoChecklist must be an array." },
        { status: 400 }
      );
    }

    const isAssigned = task.assignedTo.some((userObj) => userObj.id === userId);
    if (!isAssigned && user.role !== "admin") {
      return res.json(
        {
          message: "Not Authorized",
        },
        { status: 403 }
      );
    }
    updates.todoChecklist = todoChecklist;

    const CompletedCount = todoChecklist.filter(
      (item: any) => item.completed
    ).length;
    const totalItems = todoChecklist.length;
    updates.progress =
      totalItems > 0 ? Math.round((CompletedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      updates.status = Status.Completed;
    } else if (task.progress > 0) {
      updates.status = Status.InProgress;
    } else {
      updates.status = Status.Pending;
    }
    const updateTask = await prisma.task.update({
      where: { id: taskId },
      data: updates,
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });
    // Update todoChecklist in DB
    return res.json(
      { message: "Task todoChecklist updated successfully", updateTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task todoChecklist:", error);
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
