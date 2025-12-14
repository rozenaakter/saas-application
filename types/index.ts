// types/index.ts
// ✨ Complete Type Definitions

// ============================================
// ENUMS
// ============================================

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

// ============================================
// AI TYPES
// ============================================

export interface AISuggestions {
  subtasks: string[];
  priority: TaskPriority;
  timeEstimate: number;
  tips?: string[];
  aiModel?: string;
  success?: boolean;
  error?: string;
}

// ============================================
// TASK TYPES
// ============================================

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  userId: string;
  aiSuggestions?: AISuggestions;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  aiSuggestions?: AISuggestions | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  projectId?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  aiSuggestions?: AISuggestions | null;
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  taskCount?: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  _id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt?: string | Date;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  aiGeneratedTasks: number;
  totalProjects: number;
  completionRate: number;
}

export interface DashboardData {
  tasks: Task[];
  projects: Project[];
  stats: DashboardStats;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TasksApiResponse {
  tasks: Task[];
  count: number;
}

export interface ProjectsApiResponse {
  projects: Project[];
  count: number;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface TaskListProps {
  tasks: Task[];
  projects: Project[];
}

export interface CreateTaskButtonProps {
  projects: Project[];
}

export interface EditTaskDialogProps {
  task: Task;
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ProjectsListProps {
  projects: Project[];
}

// ============================================
// AI CHAT TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ============================================
// CONSTANTS
// ============================================

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, "default" | "secondary" | "outline"> = {
  todo: "outline",
  in_progress: "secondary",
  done: "default",
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, "default" | "secondary" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
};

export const DEFAULT_PROJECT_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];