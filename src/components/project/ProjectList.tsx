"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FolderKanban,
  MoreVertical,
  Edit,
  Trash2,
  ListTodo,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ProjectsListProps } from "@/types";

export default function ProjectsList({ projects }: ProjectsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setDeletingId(projectToDelete);
    console.log("🗑️ Deleting project:", projectToDelete);

    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
      });

      console.log("📥 Response status:", res.status);

      const data = await res.json();
      console.log("📦 Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete project");
      }

      toast.success("✅ Project deleted successfully!");
      setProjectToDelete(null);
      
      // Refresh the page
      router.refresh();
      
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      toast.error(error.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  // Empty state
  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FolderKanban className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Create your first project to organize your tasks better
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isDeleting = deletingId === project._id;

          return (
            <Card
              key={project._id}
              className={`hover:shadow-lg transition-all duration-300 border-2 ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="font-bold text-xl text-gray-900 truncate">
                        {project.name}
                      </h3>
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Task Count */}
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {project.taskCount || 0}{" "}
                        {project.taskCount === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info("Edit feature coming soon!")
                        }
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setProjectToDelete(project._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project. Tasks in this project
              will not be deleted, but they will be unassigned from the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={!!deletingId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}