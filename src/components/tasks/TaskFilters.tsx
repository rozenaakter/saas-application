"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Project {
  _id: string;
  name: string;
  color: string;
}

interface TaskFiltersProps {
  projects: Project[];
}

export default function TaskFilters({ projects }: TaskFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "";
  const currentPriority = searchParams.get("priority") || "";
  const currentProject = searchParams.get("project") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();
    router.push(`/tasks${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    router.push("/tasks");
  };

  const hasFilters = currentStatus || currentPriority || currentProject;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Select
        value={currentStatus || "all"}
        onValueChange={(v) => updateFilter("status", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={currentPriority || "all"}
        onValueChange={(v) => updateFilter("priority", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={currentProject || "all"}
        onValueChange={(v) => updateFilter("project", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project._id} value={project._id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}

      {hasFilters && (
        <div className="text-sm text-muted-foreground">
          {[
            currentStatus && `Status: ${currentStatus}`,
            currentPriority && `Priority: ${currentPriority}`,
            currentProject &&
              `Project: ${
                projects.find((p) => p._id === currentProject)?.name ||
                "Unknown"
              }`,
          ]
            .filter(Boolean)
            .join(" • ")}
        </div>
      )}
    </div>
  );
}
