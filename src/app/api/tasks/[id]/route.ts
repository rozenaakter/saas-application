import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PATCH - Update a task (status, priority, or full update)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, status, priority, projectId } = body;

    // Build update object - only include fields that are provided
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (projectId !== undefined) {
      updateFields.projectId = projectId ? new ObjectId(projectId) : null;
    }

    // Validate status if provided
    if (status && !["todo", "in_progress", "done"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    // Update the task
    const result = await db.collection("tasks").findOneAndUpdate(
      {
        _id: new ObjectId(id),
        // @ts-ignore
        userId: new ObjectId(session.user.id),
      },
      {
        $set: updateFields,
      },
      {
        returnDocument: "after",
      }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task: {
        ...result,
        _id: result._id.toString(),
        userId: result.userId.toString(),
        projectId: result.projectId?.toString(),
      },
    });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a task by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Delete the task (only if owned by the user)
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
      // @ts-ignore
      userId: new ObjectId(session.user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
