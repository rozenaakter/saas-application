"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditTaskDialog from "./EditTaskDialog";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  projectId?: string;
  createdAt: string;
  aiSuggestions?: {
    subtasks: string[];
    priority: string;
    timeEstimate: number;
  };
}

interface Project {
  _id: string;
  name: string;
  color: string;
}

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
}

export default function TaskList({ tasks: initialTasks, projects }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 🔥 REAL-TIME SOLUTION
  useEffect(() => {
    console.log("🔵 TaskList: Initial tasks loaded", initialTasks.length);
    
    // Polling solution - every 3 seconds check for updates
    const intervalId = setInterval(() => {
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          if (data.tasks && Array.isArray(data.tasks)) {
            setTasks(data.tasks);
          }
        })
        .catch(err => console.log("Polling error:", err));
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Also update when initialTasks prop changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const getProject = (projectId?: string) => {
    return projects.find((p) => p._id === projectId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      // Update UI immediately
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus as Task['status'] } : task
        )
      );
      
      toast.success("Task status updated");
      
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDuplicate = async (task: Task) => {
    setDuplicatingId(task._id);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${task.title} (Copy)`,
          description: task.description,
          projectId: task.projectId || null,
          status: task.status,
          priority: task.priority,
          aiSuggestions: task.aiSuggestions || null,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to duplicate task");

      // Force refresh
      router.refresh();
      toast.success("Task duplicated successfully");
      
    } catch (error) {
      toast.error("Failed to duplicate task");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      // Update UI immediately
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      
      toast.success("Task deleted successfully");
      
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-sm text-muted-foreground">
            Create a new task to get started or adjust your filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="space-y-3">
          {tasks.map((task) => {
            const project = getProject(task.projectId);
            const isDuplicating = duplicatingId === task._id;

            return (
              <Card
                key={task._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => {
                          const nextStatus =
                            task.status === "todo"
                              ? "in_progress"
                              : task.status === "in_progress"
                              ? "done"
                              : "todo";
                          handleStatusChange(task._id, nextStatus);
                        }}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {getStatusIcon(task.status)}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 break-words">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 break-words">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            {getStatusLabel(task.status)}
                          </Badge>
                          {project && (
                            <Badge
                              variant="secondary"
                              className="border"
                              style={{
                                backgroundColor: project.color + "20",
                                color: project.color,
                                borderColor: project.color + "40",
                              }}
                            >
                              {project.name}
                            </Badge>
                          )}
                        </div>

                        {task.aiSuggestions && task.aiSuggestions.subtasks && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs font-medium text-blue-900 mb-2">
                              AI Suggested Subtasks:
                            </p>
                            <ul className="space-y-1">
                              {task.aiSuggestions.subtasks
                                .slice(0, 3)
                                .map((subtask, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-blue-800 flex items-start gap-2"
                                  >
                                    <span className="text-blue-600 mt-0.5">
                                      •
                                    </span>
                                    <span className="break-words">
                                      {subtask}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                            {task.aiSuggestions.timeEstimate && (
                              <p className="text-xs text-blue-700 mt-2">
                                Est. time: {task.aiSuggestions.timeEstimate} min
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTask(task)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(task)}
                          disabled={isDuplicating}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {isDuplicating ? "Duplicating..." : "Duplicate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingId === task._id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingId === task._id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Edit Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          projects={projects}
          open={!!editingTask}
          onOpenChange={(open: boolean) => !open && setEditingTask(null)}
        />
      )}
    </>
  );
}




