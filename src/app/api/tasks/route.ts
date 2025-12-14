import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST - Create a new task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = await getDb();
    const body = await req.json();
    const { title, description, projectId, status, priority, aiSuggestions } =
      body;
    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (title.trim().length > 200) {
      return NextResponse.json(
        { error: "Title must be less than 200 characters" },
        { status: 400 }
      );
    }
    // Validate status
    const validStatuses = ["todo", "in_progress", "done"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }
    // Validate priority
    const validPriorities = ["low", "medium", "high"];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }
    // Validate projectId if provided
    if (projectId && projectId !== "none" && !ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }
    const task = {
      // @ts-ignore
      userId: new ObjectId(session.user.id),
      projectId:
        projectId && projectId !== "none" ? new ObjectId(projectId) : null,
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "todo",
      priority: priority || "medium",
      aiSuggestions: aiSuggestions || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("tasks").insertOne(task);
    console.log("🚀 ~ POST ~ result:", result);
    return NextResponse.json({
      success: true,
      message: "Task created successfully",
      taskId: result.insertedId.toString(),
      task: {
        ...task,
        _id: result.insertedId.toString(),
        userId: task.userId.toString(),
        projectId: task.projectId?.toString(),
      },
    });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// GET - Fetch tasks with optional filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const { searchParams } = new URL(req.url);
    // Build query filters
    const query: any = {
      // @ts-ignore
      userId: new ObjectId(session.user.id),
    };

    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const projectId = searchParams.get("project");
    if (status && status !== "all") {
      query.status = status;
    }
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    if (projectId && projectId !== "all" && ObjectId.isValid(projectId)) {
      query.projectId = new ObjectId(projectId);
    }
    const tasks = await db
      .collection("tasks")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    console.log("🚀 ~ GET ~ tasks:", tasks);
    return NextResponse.json({
      tasks: tasks.map((task) => ({
        ...task,
        _id: task._id.toString(),
        userId: task.userId.toString(),
        projectId: task.projectId?.toString(),
      })),
      count: tasks.length,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
