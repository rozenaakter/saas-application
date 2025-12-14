// app/api/projects/[id]/route.ts
// Delete Single Project - FIXED VERSION

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

// ============================================
// DELETE - Delete Project
// ============================================

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" } as ApiResponse,
        { status: 401 }
      );
    }

    // ✅ FIX: Await params
    const { id } = await context.params;

    console.log("🔍 Deleting project ID:", id);
    console.log("📏 ID length:", id.length);
    console.log("✅ Is valid ObjectId:", ObjectId.isValid(id));

    // Validate ObjectId
    if (!id || !ObjectId.isValid(id)) {
      console.log("❌ Invalid ObjectId format");
      return NextResponse.json(
        { error: "Invalid project ID format" } as ApiResponse,
        { status: 400 }
      );
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id as string);
    const projectId = new ObjectId(id);

    console.log("👤 User ID:", userId.toString());
    console.log("📁 Project ID:", projectId.toString());

    // Check if project exists and belongs to user
    const project = await db.collection("projects").findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      console.log("❌ Project not found or unauthorized");
      return NextResponse.json(
        { error: "Project not found or unauthorized" } as ApiResponse,
        { status: 404 }
      );
    }

    console.log("✅ Project found:", project.name);

    // Delete project
    const deleteResult = await db.collection("projects").deleteOne({
      _id: projectId,
      userId,
    });

    console.log("🗑️ Delete result:", deleteResult);

    if (deleteResult.deletedCount === 0) {
      throw new Error("Failed to delete project");
    }

    console.log("✅ Project deleted successfully!");

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    } as ApiResponse);
  } catch (error: any) {
    console.error("❌ Delete project error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" } as ApiResponse,
      { status: 500 }
    );
  }
}