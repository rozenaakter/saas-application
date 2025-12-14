// components/tasks/TaskList.tsx - IMPROVED VERSION
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
  ListChecks,
  Sparkles,
  Timer,
  Lightbulb
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
    tips?: string[];
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

  useEffect(() => {
    console.log("📋 Tasks loaded:", initialTasks.length);
    setTasks(initialTasks);
  }, [initialTasks]);

  const getProject = (projectId?: string) => {
    return projects.find((p) => p._id === projectId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
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
      case "todo": return "To Do";
      case "in_progress": return "In Progress";
      case "done": return "Done";
      default: return status;
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
            Create a new task to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => {
          const project = getProject(task.projectId);
          const isDuplicating = duplicatingId === task._id;

          return (
            <Card key={task._id} className="hover:shadow-lg transition-all duration-300 border-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => {
                        const nextStatus =
                          task.status === "todo" ? "in_progress" :
                          task.status === "in_progress" ? "done" : "todo";
                        handleStatusChange(task._id, nextStatus);
                      }}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(task.status)}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* TASK TITLE */}
                      <h3 className="font-bold text-2xl mb-3 text-gray-900 leading-tight">
                        {task.title || "Untitled Task"}
                      </h3>

                      {/* METADATA BADGES */}
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <Badge variant={getPriorityColor(task.priority)} className="px-3 py-1.5 font-semibold">
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1.5">
                          {getStatusLabel(task.status)}
                        </Badge>
                        {project && (
                          <Badge
                            variant="secondary"
                            className="border px-3 py-1.5"
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

                      {/* ✨ AI GENERATED DETAILED TO-DO LIST */}
                      {task.aiSuggestions && task.aiSuggestions.subtasks && task.aiSuggestions.subtasks.length > 0 && (
                        <div className="mt-5 p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200 shadow-sm">
                          
                          {/* HEADER */}
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-indigo-200">
                            <Sparkles className="h-6 w-6 text-indigo-600" />
                            <div>
                              <h4 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                                <ListChecks className="h-5 w-5" />
                                AI Generated To-Do List
                              </h4>
                              <p className="text-xs text-indigo-600 mt-0.5">
                                Follow these steps to complete your task
                              </p>
                            </div>
                          </div>

                          {/* DETAILED STEPS */}
                          <div className="space-y-3 mb-4">
                            {task.aiSuggestions.subtasks.map((subtask, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md"
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed flex-1 pt-1">
                                  {subtask}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* TIME ESTIMATE & TIPS */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t-2 border-indigo-200">
                            {/* Time Estimate */}
                            {task.aiSuggestions.timeEstimate && (
                              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-indigo-100">
                                <Timer className="h-5 w-5 text-indigo-600" />
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">Estimated Time</p>
                                  <p className="text-lg font-bold text-indigo-900">
                                    {task.aiSuggestions.timeEstimate} minutes
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* AI Tips */}
                            {task.aiSuggestions.tips && task.aiSuggestions.tips.length > 0 && (
                              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="h-5 w-5 text-amber-600" />
                                  <p className="text-xs font-bold text-amber-900">Pro Tips</p>
                                </div>
                                <ul className="space-y-1">
                                  {task.aiSuggestions.tips.map((tip, idx) => (
                                    <li key={idx} className="text-xs text-amber-800 flex items-start gap-1.5">
                                      <span className="text-amber-600 mt-0.5">•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
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