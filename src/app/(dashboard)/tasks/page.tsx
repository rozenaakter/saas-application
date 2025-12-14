import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskList from "@/components/tasks/TaskList";
import { Skeleton } from "@/components/ui/skeleton";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

interface TasksPageProps {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    project?: string;
  }>;
}

export default async function TasksPage(props: TasksPageProps) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  const db = await getDb();
  // @ts-ignore
  const userId = new ObjectId(session!.user.id);

  // Build filter query - FIXED
  const filter: any = { userId };

  if (searchParams.status && searchParams.status !== "all") {
    filter.status = searchParams.status;
  }

  if (searchParams.priority && searchParams.priority !== "all") {
    filter.priority = searchParams.priority;
  }

  if (
    searchParams.project &&
    searchParams.project !== "all" &&
    ObjectId.isValid(searchParams.project)
  ) {
    filter.projectId = new ObjectId(searchParams.project);
  }

  // Fetch tasks and projects
  const [tasks, projects] = await Promise.all([
    db.collection("tasks").find(filter).sort({ createdAt: -1 }).toArray(),
    db.collection("projects").find({ userId }).toArray(),
  ]);

  // Serialize ObjectIds for client components
  const serializedTasks = tasks.map((task) => ({
    ...task,
    _id: task._id.toString(),
    userId: task.userId.toString(),
    projectId: task.projectId?.toString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt?.toISOString(),
  }));

  const serializedProjects = projects.map((project) => ({
    ...project,
    _id: project._id.toString(),
    userId: project.userId.toString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage and track your tasks with AI assistance
          </p>
        </div>
        {/* @ts-ignore */}
        <CreateTaskButton projects={serializedProjects} />
      </div>
      {/* @ts-ignore */}
      <TaskFilters projects={serializedProjects} />

      <Suspense fallback={<TasksSkeleton />}>
        {/* @ts-ignore */}
        <TaskList tasks={serializedTasks} projects={serializedProjects} />
      </Suspense>
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
