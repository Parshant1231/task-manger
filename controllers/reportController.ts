import { Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import excelJS from "exceljs";
import { NextRequest, NextResponse as res } from "next/server";

export const exportTaskReport = async (req: NextRequest) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      {
        header: "Due Date",
        key: "dueDate",
        width: 20,
        style: { numFmt: "yyyy-mm-dd" },
      },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo =
        task.assignedTo
          ?.map((user) => `${user.name}(${user.email})`)
          .join(", ") || "Unassigned";

      worksheet.addRow({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    // Generate buffer (in-memory Excel file)
    const buffer = await workbook.xlsx.writeBuffer();

    return new res(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="tasks_report.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.json({ message: "Error expecting tasks" }, { status: 500 });
  }
};

export const exportUsersReport = async (req: NextRequest) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        id: true,
      },
    });
    const userTasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });

    const userTaskMap: Record<
      string,
      {
        taskCount: number;
        pendingTasks: number;
        inProgressTasks: number;
        completedTasks: number;
      }
    > = {};

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          const userId = assignedUser.id;
          if (!userTaskMap[userId]) {
            userTaskMap[userId] = {
              taskCount: 0,
              pendingTasks: 0,
              inProgressTasks: 0,
              completedTasks: 0,
            };
          }

          userTaskMap[userId].taskCount += 1;

          if (task.status === Status.Pending) {
            userTaskMap[userId].pendingTasks += 1;
          } else if (task.status === Status.InProgress) {
            userTaskMap[userId].inProgressTasks += 1;
          } else if (task.status === Status.Completed) {
            userTaskMap[userId].completedTasks += 1;
          }
        });
      }
    });
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      {
        header: "In Progress Tasks",
        key: "inProgressTasks",
        width: 20,
      },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    // Create buffer & return response
    const buffer = await workbook.xlsx.writeBuffer();

    return new res(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="users_report.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.json({ message: "Error exporting tasks" }, { status: 500 });
  }
};
