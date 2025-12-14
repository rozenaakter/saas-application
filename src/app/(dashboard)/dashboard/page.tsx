// app/dashboard/page.tsx
// Simple but Impressive Dashboard with Types

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  ListTodo,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { DashboardData, Project, Task, TASK_PRIORITY_COLORS, TASK_STATUS_LABELS } from "../../../../types";

// ============================================
// GET DASHBOARD DATA
// ============================================

async function getDashboardData(): Promise<DashboardData | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const db = await getDb();
  const userId = new ObjectId(session.user.id as string);

  // Get recent tasks
  const tasksRaw = await db
    .collection("tasks")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  // Get all projects
  const projectsRaw = await db
    .collection("projects")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  // Calculate statistics
  const totalTasks = await db.collection("tasks").countDocuments({ userId });
  const completedTasks = await db
    .collection("tasks")
    .countDocuments({ userId, status: "done" });
  const inProgressTasks = await db
    .collection("tasks")
    .countDocuments({ userId, status: "in_progress" });
  const todoTasks = await db
    .collection("tasks")
    .countDocuments({ userId, status: "todo" });
  const aiGeneratedTasks = await db
    .collection("tasks")
    .countDocuments({ userId, aiSuggestions: { $exists: true, $ne: null } });

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Convert to proper types
  const tasks: Task[] = tasksRaw.map((t) => ({
    _id: t._id.toString(),
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    projectId: t.projectId?.toString(),
    userId: t.userId.toString(),
    aiSuggestions: t.aiSuggestions,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  const projects: Project[] = projectsRaw.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description,
    color: p.color,
    userId: p.userId.toString(),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return {
    tasks,
    projects,
    stats: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      aiGeneratedTasks,
      totalProjects: projects.length,
      completionRate,
    },
  };
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const data = await getDashboardData();

  if (!data) {
    redirect("/auth/signin");
  }

  const { tasks, projects, stats } = data;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name || "User"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your tasks and projects
        </p>
      </div>

      {/* ============================================ */}
      {/* STATS CARDS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tasks
            </CardTitle>
            <ListTodo className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalTasks}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.todoTasks} to do • {stats.inProgressTasks} in progress
            </p>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.completedTasks}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{stats.completionRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Powered */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              AI Powered
            </CardTitle>
            <Sparkles className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.aiGeneratedTasks}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tasks with AI suggestions
            </p>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Projects
            </CardTitle>
            <FolderKanban className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalProjects}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active projects</p>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* RECENT TASKS & PROJECTS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Tasks
              </CardTitle>
              <Link
                href="/tasks"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <ListTodo className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No tasks yet</p>
                <Link
                  href="/tasks"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Create your first task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Link
                    key={task._id}
                    href="/tasks"
                    className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {TASK_STATUS_LABELS[task.status]}
                          </Badge>
                          <Badge
                            variant={TASK_PRIORITY_COLORS[task.priority]}
                            className="text-xs"
                          >
                            {task.priority.toUpperCase()}
                          </Badge>
                          {task.aiSuggestions && (
                            <Badge
                              variant="outline"
                              className="text-xs border-purple-200 text-purple-700"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Projects
              </CardTitle>
              <Link
                href="/projects"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No projects yet</p>
                <Link
                  href="/projects"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2 inline-block"
                >
                  Create your first project
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href="/projects"
                    className="block p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {project.name}
                        </h4>
                        {project.description && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* QUICK ACTIONS */}
      {/* ============================================ */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/tasks"
              className="group p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mx-auto mb-3 transition-colors">
                <ListTodo className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium text-gray-900">Create Task</p>
              <p className="text-xs text-gray-500 mt-1">
                Add a new task with AI
              </p>
            </Link>

            <Link
              href="/projects"
              className="group p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center mx-auto mb-3 transition-colors">
                <FolderKanban className="h-6 w-6 text-orange-600" />
              </div>
              <p className="font-medium text-gray-900">New Project</p>
              <p className="text-xs text-gray-500 mt-1">
                Organize your work
              </p>
            </Link>

            <Link
              href="/ai"
              className="group p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mx-auto mb-3 transition-colors">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <p className="font-medium text-gray-900">AI Assistant</p>
              <p className="text-xs text-gray-500 mt-1">
                Get AI powered help
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}