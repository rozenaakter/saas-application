// app/projects/page.tsx
// Simple Projects Management with Types

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Project } from "@/types";
import CreateProjectButton from "@/components/project/CreateProjectButton";
import ProjectsList from "@/components/project/ProjectList";


// ============================================
// GET PROJECTS DATA
// ============================================

async function getProjects(): Promise<Project[] | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const db = await getDb();
  const userId = new ObjectId(session.user.id as string);

  const projectsRaw = await db
    .collection("projects")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  // Count tasks per project
  const projects: Project[] = await Promise.all(
    projectsRaw.map(async (project) => {
      const taskCount = await db.collection("tasks").countDocuments({
        userId,
        projectId: project._id,
      });

      return {
        _id: project._id.toString(),
        name: project.name,
        description: project.description,
        color: project.color,
        userId: project.userId.toString(),
        taskCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    })
  );

  return projects;
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const projects = await getProjects();

  if (!projects) {
    redirect("/auth/signin");
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Organize your tasks into projects
          </p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Projects List */}
      <ProjectsList projects={projects} />
    </div>
  );
}