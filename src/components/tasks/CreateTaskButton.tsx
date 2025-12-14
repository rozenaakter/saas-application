"use client";
import { CheckCircle2, Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface Project {
  _id: string;
  name: string;
  color: string;
}

interface AISuggestions {
  subtasks: string[];
  priority: "low" | "medium" | "high";
  timeEstimate: number;
  tips?: string[];
  aiModel?: string;
  success?: boolean;
}

interface CreateTaskButtonProps {
  projects: Project[];
}

export default function CreateTaskButton({ projects }: CreateTaskButtonProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiStatus, setAiStatus] = useState<string>("");
  const [aiModelUsed, setAiModelUsed] = useState<string>("");
  
  const router = useRouter();

  // AI functionality
  const getAISuggestions = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title first");
      return;
    }
    
    setIsLoadingAI(true);
    setAiSuggestions(null);
    setAiStatus("🔄 Connecting to AI...");
    
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim()
        }),
      });

      setAiStatus("⚡ Processing AI response...");
      
      const data = await res.json();
      
      if (data.error) {
        setAiStatus(`❌ Error: ${data.error}`);
        toast.error(data.error);
        return;
      }

      setAiSuggestions(data);
      setAiModelUsed(data.aiModel || "unknown");
      
      if (data.success) {
        setAiStatus("✅ AI suggestions generated");
        toast.success("AI suggestions generated!");
      } else {
        setAiStatus("⚠️ Using fallback suggestions");
        toast.info("Using basic suggestions");
      }
      
    } catch (error) {
      setAiStatus("❌ Failed to connect to AI");
      toast.error("Failed to get AI suggestions");
      console.error("AI Error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating Task....");
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          projectId: projectId || null,
          status,
          priority,
          aiSuggestions: aiSuggestions || null,
        }),
      });
      
      const data = await res.json();
      console.log("API Response:", data);
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }
      
      toast.success("Task created successfully");
      
      // Reset form
      resetForm();
      setOpen(false);

      // ✅ 1. RELOAD THE PAGE - 100% WORKING
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      // ✅ 2. Alternative: Add query parameter to force refresh
      // setTimeout(() => {
      //   router.push(window.location.pathname + '?refresh=' + Date.now());
      // }, 300);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
      console.error("Create task error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setProjectId("");
    setStatus("todo");
    setPriority("medium");
    setAiSuggestions(null);
    setAiStatus("");
    setAiModelUsed("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your workflow. Use AI to get smart suggestions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Design landing page wireframes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
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
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Suggestions Section */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-sm">AI Assistant</h3>
                    {/* AI Status Display */}
                    {aiStatus && (
                      <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                        aiStatus.includes('✅') ? 'bg-green-100 text-green-800' :
                        aiStatus.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' :
                        aiStatus.includes('❌') ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        <span className="font-medium">{aiStatus}</span>
                        {aiModelUsed && aiModelUsed !== "unknown" && (
                          <span className="ml-2">({aiModelUsed})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getAISuggestions}
                  disabled={isLoadingAI || !title}
                >
                  {isLoadingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Suggestions
                    </>
                  )}
                </Button>
              </div>

              {/* Debug Info */}
              {aiModelUsed && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500">
                    Model: <span className="font-medium">{aiModelUsed}</span>
                  </span>
                </div>
              )}

              {aiSuggestions ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>AI analysis complete</span>
                  </div>
                  
                  {aiSuggestions.subtasks && aiSuggestions.subtasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Suggested Subtasks:
                      </h4>
                      <ul className="space-y-1">
                        {aiSuggestions.subtasks.map(
                          (subtask: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>{subtask}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-sm">
                    {aiSuggestions.priority && (
                      <div>
                        <span className="text-gray-600">Priority: </span>
                        <Badge
                          variant={
                            aiSuggestions.priority === "high"
                              ? "destructive"
                              : aiSuggestions.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {aiSuggestions.priority}
                        </Badge>
                      </div>
                    )}
                    
                    {aiSuggestions.timeEstimate && (
                      <div>
                        <span className="text-gray-600">Estimated: </span>
                        <span className="font-medium">
                          {aiSuggestions.timeEstimate} min
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI Tips */}
                  {aiSuggestions.tips && aiSuggestions.tips.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium mb-1">Tips:</h4>
                      <ul className="space-y-1">
                        {aiSuggestions.tips.map((tip: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">💡</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter a task title and click "Get Suggestions" to receive AI-powered insights.
                  </p>
                  {!title && (
                    <p className="text-xs text-amber-600">
                      ⚠ Enter a task title above to enable AI suggestions
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-3 pt-4 col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !title.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}