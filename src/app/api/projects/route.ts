// app/api/projects/route.ts
// Projects API - Create & Get

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, CreateProjectInput } from "@/types";

// ============================================
// POST - Create Project
// ============================================

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" } as ApiResponse,
        { status: 401 }
      );
    }

    const db = await getDb();
    const body: CreateProjectInput = await req.json();
    const { name, description, color } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" } as ApiResponse,
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Project name must be less than 100 characters" } as ApiResponse,
        { status: 400 }
      );
    }

    if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
      return NextResponse.json(
        { error: "Invalid color format" } as ApiResponse,
        { status: 400 }
      );
    }

    // Create project
    const project = {
      userId: new ObjectId(session.user.id as string),
      name: name.trim(),
      description: description?.trim() || "",
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("projects").insertOne(project);

    console.log("✅ Project created:", result.insertedId);

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data: {
        ...project,
        _id: result.insertedId.toString(),
        userId: project.userId.toString(),
      },
    } as ApiResponse);
  } catch (error: any) {
    console.error("❌ Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" } as ApiResponse,
      { status: 500 }
    );
  }
}

// ============================================
// GET - Fetch Projects
// ============================================

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" } as ApiResponse,
        { status: 401 }
      );
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id as string);

    const projects = await db
      .collection("projects")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: projects.map((p) => ({
        ...p,
        _id: p._id.toString(),
        userId: p.userId.toString(),
      })),
    } as ApiResponse);
  } catch (error: any) {
    console.error("❌ Fetch projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" } as ApiResponse,
      { status: 500 }
    );
  }
}